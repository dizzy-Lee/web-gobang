var socket = io('ws://10.205.5.177:8080');

var cvs = document.getElementById('cvs');
var ctx = cvs.getContext('2d');

var GRID_SIZE = 40;
var H_SIZE  = null;
var V_SIZE  = null;

var checkerBoard = [];
var turn = '';

socket.on('conn', function(data) {

  console.log(data);

  color = data.color;
  document.querySelector('#color').innerHTML = color;

  HORIZONTAL_SIZE  = data.hs;
  VERTICAL_SIZE  = data.vs;

  cvs.width = HORIZONTAL_SIZE  * GRID_SIZE;
  cvs.height = VERTICAL_SIZE  * GRID_SIZE;

  if (data.num === 2) init();
})

socket.on('getCheckerBoard', function(data) {
  console.log(data);

  checkerboard = data.checkerboard;
  turn = data.turn;

  if (color === turn) {
    cvs.onclick = putChess;
  } else {
    cvs.onclick = null;
  }
  drawCheckerBoard();

  document.querySelector('#info').innerHTML = '现在轮到' + turn + '落子'
})

socket.on('gameover', function(data) {
  document.querySelector('#info').innerHTML = (data === 'black' ? '黑棋' : '白棋') + '胜'
  cvs.onclick = null;
})

function init() {
  if (color === 'null') return;
  // cvs.onclick = putChess;
}

//放置棋子事件
function putChess(e) {
  var x = e.pageX - cvs.offsetLeft;
  var y = e.pageY - cvs.offsetTop;
  x = parseInt(x / GRID_SIZE);
  y = parseInt(y / GRID_SIZE);

  if (checkerboard[x][y].state) return;

  drawArc(x, y);

  socket.emit('putchess', x, y);
}

//绘制棋子
function drawArc(x, y) {
  ctx.beginPath();
  // ctx.fillStyle = (turn === true ? '#fff' : '#000');
  ctx.arc(x * GRID_SIZE + GRID_SIZE / 2, y * GRID_SIZE + GRID_SIZE / 2, GRID_SIZE / 2 * 0.9, 0, 2 * Math.PI);
  ctx.fillStyle = (checkerboard[x][y].type === 'white' ? '#eee' : '#000');
  ctx.fill();
  ctx.closePath();
}

//画棋盘
function drawCheckerBoard() {
  for (let i = 0; i < HORIZONTAL_SIZE; i += 1) {
    for (let j = 0; j < VERTICAL_SIZE; j += 1) {
      ctx.beginPath();
      ctx.strokeStyle = '#000';
      ctx.fillStyle = '#FFB90F';
      ctx.fillRect(i * GRID_SIZE, j * GRID_SIZE, GRID_SIZE, GRID_SIZE);
      ctx.strokeRect(i * GRID_SIZE, j * GRID_SIZE, GRID_SIZE, GRID_SIZE)
      ctx.closePath();
    }
  }

  for (let i = 0; i < HORIZONTAL_SIZE; i++) {
    for (let j = 0; j < VERTICAL_SIZE; j++) {
      if (checkerboard[i][j].state) drawArc(i, j);
    }
  }
}
