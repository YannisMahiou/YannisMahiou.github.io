var cv = document.getElementById("mycanvas");
var ctx = cv.getContext('2d');
var radius = 8;
var blur = 50;
var colorClient;
var timeDelete = 500; // 0.5 seconds
var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

function resizeCanvas() {
    cv.width = window.innerWidth;
    cv.height = window.innerHeight;
    ctx.canvas.width = cv.width;
    ctx.canvas.height = cv.height;
}

var dy = 0.5;
var blocks = [];

function Block(x, y, color) {

    this.x = parseFloat(x);
    this.y = parseFloat(y);
    this.color = color;
    this.delete = false;
    this.radius = 0;
    var self = this;

    this.update = function() {
        if (this.delete) {
            if (this.y < (100 + radius)) {
                this.y += dy;
            } else {
                var index = blocks.indexOf(self);
                delete blocks[index];
            }
        }
        if (this.radius < radius) {
            this.radius += 1;
        }
    }

    this.render = function() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = blur;
        ctx.arc(PctoPx(cv.width, this.x), PctoPx(cv.height, this.y), this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }

    setTimeout(function() {
        self.delete = true;
    }, timeDelete);
}

function PxtoPc(wrapper, pc) {
    return parseFloat(pc / wrapper * 100).toFixed(2);
}

function PctoPx(wrapper, px) {
    return (wrapper / 100) * px;
}

function draw() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    blocks.forEach(function(e) {
        e.update();
        e.render();
    });
};

function animated() {
    requestAnimationFrame(animated);
    draw();

    ctx.font = "30px monospace";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.shadowBlur = 0;
    ctx.font = "14px monospace";
    ctx.textAlign = "center";
}

resizeCanvas();
animated();


function addBlock(data) {
    blocks.push(new Block(data.x, data.y, data.color));
}

var colors = [
  '#03a9f4',
  '#f44336',
  '#e91e63',
  '#ff9800',
  '#3f51b5'
];
var indexColor = 0;

colorClient = colors[indexColor];

time=setInterval(function(){
  if(indexColor < colors.length - 1){
     indexColor += 1;
  }else{
     indexColor = 0;
  }

  colorClient = colors[indexColor];
},1000)


window.addEventListener('resize', resizeCanvas, false);

cv.addEventListener('mousemove', function(e) {

    var xPercent = PxtoPc(cv.width, e.clientX);
    var yPercent = PxtoPc(cv.height, e.clientY);
  
     addBlock({
        x: xPercent,
        y: yPercent,
        color: colorClient
    });

}, false);