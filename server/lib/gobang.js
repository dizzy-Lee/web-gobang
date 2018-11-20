const HORIZONTAL_SIZE = 17;
const VERTICAL_SIZE = 17;

class Gobang {
  constructor() {
    this.HORIZONTAL_SIZE = HORIZONTAL_SIZE;
    this.VERTICAL_SIZE = VERTICAL_SIZE;

    this.players = [];//玩家列表
    this.checkerBoard = [];//棋盘
    this.colorList = ['white', 'black'];//棋子颜色
    this.gaming = false;//标识游戏状态
    this.turn = 'black';//标志当前的落子颜色
  }

  //创建玩家
  createPlayer(socket) {
    let playerCount = this.players.length;
    if (playerCount >= 2) return false;

    let player = {
      socket,
      color: this.colorList.pop()
    }

    this.players.push(player);
    socket.player = player;

    return true;
  }

  //初始化
  init() {
    for (let i = -5; i < this.HORIZONTAL_SIZE + 5; i ++) {
      this.checkerBoard[i] = [];
      for (let j = -5; j < this.VERTICAL_SIZE + 5; j ++) {
        this.checkerBoard[i][j] = {
          state: false,
          type: true
        }
      }
    }

    this.gaming = true;
  }

//获取当前玩家数量
  getPlayerNum() {
    return this.players.length;
  }

  //离开房间
  leftGame(socket) {
    if (!socket.player) return;

    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].color === socket.player.color) {
        this.colorList.push(this.players[i].color);
        this.players.splice(i, 1);
        break;
      }
    }
  }

  //放置棋子
  putChess(x, y) {
    this.checkerBoard[x][y].state = true;
    this.checkerBoard[x][y].type = this.turn;
    this.toggleTurn();

  }

  //反转棋子颜色
  toggleTurn() {
    this.turn = (this.turn === 'black' ? 'white' : 'black');
  }

  gameover(x, y) {
    return this.checkAllDirectionChess(x, y);
  }

  //判断一个棋子所有方向上是否有满足五子棋胜利条件的情况
  checkAllDirectionChess(x, y) {
    if (this.checkOneLineChess(x - 5, y - 5, 1, 1, this.checkerBoard[x][y].type)) return true;
    if (this.checkOneLineChess(x, y - 5, 0, 1, this.checkerBoard[x][y].type)) return true;
    if (this.checkOneLineChess(x + 5, y - 5, -1, 1, this.checkerBoard[x][y].type)) return true;
    if (this.checkOneLineChess(x - 5, y, 1, 0, this.checkerBoard[x][y].type)) return true;
  }

  //判断一个方向上是否满足五子棋胜利的条件
  checkOneLineChess(tpx, tpy, xPlus, yPlus, type) {
    var count = 0;
    for (var i = 0; i < 10; i+=1) {
      if (this.checkerBoard[tpx][tpy].type === type && this.checkerBoard[tpx][tpy].state === true) {
        count+=1;
        if (count >= 5) return true;
      } else {
        count = 0;
      }
      tpx += xPlus;
      tpy += yPlus;
    }
    return false
  }

}

module.exports = Gobang;