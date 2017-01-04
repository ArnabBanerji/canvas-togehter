var canvasWidth = 490,
    canvasHeight = 220,
    canvasDiv = document.getElementById('canvasDiv'),
    canvas = document.createElement('canvas');
var clickDataArr = [];
var paint = false;
var socket = io();

function ClickData(x, y, dragging) {
    this.x = x;
    this.y = y;
    this.dragging = dragging;
    return this;
}

canvas.setAttribute('width', canvasWidth);
canvas.setAttribute('height', canvasHeight);
canvas.setAttribute('id', 'canvas');
canvasDiv.appendChild(canvas);
context = canvas.getContext("2d");

var canvasElem = $('#canvas');


canvasElem.mousedown(function (e) {
    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;
    paint = true;
    clickDataArr = [];
    addClick(mouseX, mouseY);
});

canvasElem.mousemove(function (e) {
    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;
    if (paint) {
        addClick(mouseX, mouseY, true);
    }
});

canvasElem.on('mouseup mouseleave', function (e) {
    paint = false;
});

function addClick(x, y, dragging) {
    var clickData = new ClickData(x, y, dragging);
    var clickDataStr = JSON.stringify(clickData);
    socket.emit('toServer', clickDataStr);
}

socket.on('fromServer', function (msg) {
    var clickData = JSON.parse(msg);
    clickDataArr.push(clickData);
    redraw(clickDataArr);
});


function redraw(clickDataArray) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
    context.strokeStyle = "#df4b26";
    context.lineJoin = "round";
    context.lineWidth = 5;
    for (var i = 0; i < clickDataArray.length; i++) {
        var clickData = clickDataArray[i];
        context.beginPath();
        if (clickData.dragging && i) {
            context.moveTo(clickDataArray[i - 1].x, clickDataArray[i - 1].y);
        } else {
            context.moveTo(clickData.x - 1, clickData.y);
        }
        context.lineTo(clickData.x, clickData.y);
        context.closePath();
        context.stroke();
    }
}
