// CAN\NVAS.js plugin
// ninivert, december 2016


(function (window, document) {
  /**
   * CAN\VAS Plugin - Adding line breaks to canvas
   * @arg {string} [str=Hello World] - text to be drawn
   * @arg {number} [x=0]             - top left x coordinate of the text
   * @arg {number} [y=textSize]      - top left y coordinate of the text
   * @arg {number} [w=canvasWidth]   - maximum width of drawn text
   * @arg {number} [lh=1]            - line height
   * @arg {number} [method=fill]     - text drawing method, if 'none', text will not be rendered
   */

  CanvasRenderingContext2D.prototype.drawBreakingText = function (
    str,
    x,
    y,
    w,
    lh,
    method
  ) {
    // local variables and defaults
    var textSize = parseInt(this.font.replace(/\D/gi, ""));
    var textParts = [];
    var textPartsNo = 0;
    var words = [];
    var currLine = "";
    var testLine = "";
    str = str || "";
    x = x || 0;
    y = y || 0;
    w = w || this.canvas.width;
    lh = lh || 1;
    method = method || "fill";

    // manual linebreaks
    textParts = str.split("\n");
    textPartsNo = textParts.length;

    // split the words of the parts
    for (var i = 0; i < textParts.length; i++) {
      words[i] = textParts[i].split(" ");
    }

    // now that we have extracted the words
    // we reset the textParts
    textParts = [];

    // calculate recommended line breaks
    // split between the words
    for (var i = 0; i < textPartsNo; i++) {
      // clear the testline for the next manually broken line
      currLine = "";

      for (var j = 0; j < words[i].length; j++) {
        testLine = currLine + words[i][j] + " ";

        // check if the testLine is of good width
        if (this.measureText(testLine).width > w && j > 0) {
          textParts.push(currLine);
          currLine = words[i][j] + " ";
        } else {
          currLine = testLine;
        }
      }
      // replace is to remove trailing whitespace
      textParts.push(currLine);
    }

    // render the text on the canvas
    for (var i = 0; i < textParts.length; i++) {
      if (method === "fill") {
        this.fillText(
          textParts[i].replace(/((\s*\S+)*)\s*/, "$1"),
          x,
          y + textSize * lh * i
        );
      } else if (method === "stroke") {
        this.strokeText(
          textParts[i].replace(/((\s*\S+)*)\s*/, "$1"),
          x,
          y + textSize * lh * i
        );
      } else if (method === "none") {
        return {
          textParts: textParts,
          textHeight: textSize * lh * textParts.length
        };
      } else {
        console.warn("drawBreakingText: " + method + "Text() does not exist");
        return false;
      }
    }

    return {
      textParts: textParts,
      textHeight: textSize * lh * textParts.length
    };
  };
})(window, document);

var canvas = document.createElement("canvas");
var canvasWrapper = document.getElementById("canvasWrapper");
canvasWrapper.appendChild(canvas);
canvas.width = 850;
canvas.height = 476;
var ctx = canvas.getContext("2d");
var padding = 15;
var textTname = "?????? ????????? ??????";
var textTop = "????????????";
var textBottom = "?????????";
var textSizeTname = 15;
var textSizeTop = 20;
var textSizeBottom = 20;
var image = document.createElement("img");
var TnameColor = "#FF0000";
var BColor = "#00FF00";
var TColor = "#0000FF";



image.onload = function (ev) {
  // delete and recreate canvas do untaint it
  canvas.outerHTML = "";
  canvas = document.createElement("canvas");
  canvasWrapper.appendChild(canvas);
  ctx = canvas.getContext("2d");
  document.getElementById("trueSize").click();
  document.getElementById("trueSize").click();

  draw();
};

document.getElementById("imgURL").oninput = function (ev) {
  image.src = this.value;
};

document.getElementById("imgFile").onchange = function (ev) {
  var reader = new FileReader();
  reader.onload = function (ev) {
    image.src = reader.result;
  };
  reader.readAsDataURL(this.files[0]);
};

document.getElementById("textTname").oninput = function (ev) {
  textTname = this.value;
  draw();
};

document.getElementById("textTop").oninput = function (ev) {
  textTop = this.value;
  draw();
};

document.getElementById("textBottom").oninput = function (ev) {
  textBottom = this.value;
  draw();
};

document.getElementById("TnameColor").oninput = function (ev) {
  TnameColor = this.value;
  draw();
};

document.getElementById("BColor").oninput = function (ev) {
  BColor = this.value;
  draw();
};

document.getElementById("TColor").oninput = function (ev) {
  TColor = this.value;
  draw();
};



document.getElementById("textSizeTname").oninput = function (ev) {
  textSizeTname = parseInt(this.value);
  draw();
  document.getElementById("textSizeTnameOut").innerHTML = this.value;
};
document.getElementById("textSizeTop").oninput = function (ev) {
  textSizeTop = parseInt(this.value);
  draw();
  document.getElementById("textSizeTopOut").innerHTML = this.value;
};
document.getElementById("textSizeBottom").oninput = function (ev) {
  textSizeBottom = parseInt(this.value);
  draw();
  document.getElementById("textSizeBottomOut").innerHTML = this.value;
};

document.getElementById("trueSize").onchange = function (ev) {
  if (document.getElementById("trueSize").checked) {
    canvas.classList.remove("fullwidth");
  } else {
    canvas.classList.add("fullwidth");
  }
};

document.getElementById("export").onclick = function () {
  var img = canvas.toDataURL("image/png");
  var link = document.createElement("a");
  link.download = "WttBCMainTwt";
  link.href = img;
  link.click();

  var win = window.open("", "_blank");
  win.document.write(
    '<img style="box-shadow: 0 0 1em 0 dimgrey;" src="' + img + '"/>'
  );
  win.document.write(
    '<h1 style="font-family: Helvetica; font-weight: 300">Right Click > Save As<h1>'
  );
  win.document.body.style.padding = "1em";
};

function style(font, size, align, base) {
  ctx.font = size + "px " + font;
  ctx.textAlign = align;
  ctx.textBaseline = base;
}

function draw() {
  // uppercase the text
  var tname = textTname.toUpperCase();
  var top = textTop
  var bottom = textBottom

  // set appropriate canvas size
  canvas.width = image.width;
  canvas.height = image.height;

  // draw the image
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);


  var _textSizeTname = (textSizeTname / 500) *canvas.width;
  var _textSizeTop = (textSizeTop / 500) * canvas.width;
  var _textSizeBottom = (textSizeBottom / 500) * canvas.width;


 //draw Tname text
  ctx.fillStyle = TnameColor;
  style("Rajdhani", _textSizeTname, "left", "tname");
  var height = ctx.drawBreakingText(tname, 1, 1, null, 1, "none").textHeight;
  console.log(ctx.drawBreakingText(tname, 1, 1, null, 1, "none"));
  ctx.drawBreakingText(
    tname,
    265,
    159,
    null,
    1,
    "fill"
  );

  // ????????????
  ctx.fillStyle = TColor;
  style("Noto Sans KR", _textSizeTop, "left", "top");
  var height = ctx.drawBreakingText(top, 1, 1, null, 1, "none").textHeight;
  console.log(ctx.drawBreakingText(top, 1, 1, null, 1, "none"));
  ctx.drawBreakingText(
    top,
    75,
    195,
    null,
    1,
    "fill"
  );


  // ?????????
  ctx.fillStyle = BColor;
  style("Noto Sans KR", _textSizeBottom, "right", "bottom");
  var height = ctx.drawBreakingText(bottom, 1, 1, null, 1, "none").textHeight;
  console.log(ctx.drawBreakingText(bottom, 1, 1, null, 1, "none"));
  ctx.drawBreakingText(
    bottom,
    925,
    140,
    null,
    1,
    "fill"
  );
}

image.src =
  "https://static.wixstatic.com/media/6c923f_6caf3f35f22740148377807c3f11ca5b~mv2.png";

document.getElementById("textSizeTname").value = textSizeTname;
document.getElementById("textSizeTop").value = textSizeTop;
document.getElementById("textSizeBottom").value = textSizeBottom;
document.getElementById("textSizeTnameOut").innerHTML = textSizeTname;
document.getElementById("textSizeTopOut").innerHTML = textSizeTop;
document.getElementById("textSizeBottomOut").innerHTML = textSizeBottom;
