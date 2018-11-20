var server = require('http').createServer();
var io = require('socket.io')(server);
var Gobang = require('./lib/gobang');

server.listen(8080, '10.205.5.177');
var gobang = new Gobang();

io.on('connection', function(socket) {
  if (gobang.createPlayer(socket)) {
    socket.emit('conn', {
      color: socket.player.color,
      num: gobang.getPlayerNum(),
      hs: gobang.HORIZONTAL_SIZE,
      vs: gobang.VERTICAL_SIZE
    });
    if (gobang.getPlayerNum() >= 2) {
      gobang.init();
      broadcast();
    }
  } else {
    socket.emit('conn', {
      color: 'null',
      num: gobang.getPlayerNum(),
      hs: gobang.HORIZONTAL_SIZE,
      vs: gobang.VERTICAL_SIZE
    });
    broadcast();
  };

  socket.on('disconnect', function() {
    gobang.leftGame(socket);
  })

  socket.on('putchess', function(x, y) {
    x = parseInt(x);
    y = parseInt(y);

    gobang.putChess(x, y);
    broadcast();

    if (gobang.gameover(x, y)){
      io.sockets.emit('gameover', gobang.turn === 'black' ? 'white' : 'black');
    }
  });
});

function broadcast() {
  io.sockets.emit('getCheckerBoard', {
    turn: gobang.turn,
    checkerboard: gobang.checkerBoard
  });
}
