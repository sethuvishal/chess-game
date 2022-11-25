import { check } from "./check.js";
import { whiteState, blackState } from "./kingState.js";

function pushEl(board, changedBoard) {
  for (var i = 0; i < board.length; i++) {
    changedBoard.push([]);
    for (var j = 0; j < board[i].length; j++) {
      let p1 = { ...board[i][j] };
      changedBoard[i].push(p1);
    }
  }
}

function canMove(x, y, i, j, changedBoard, curState) {
  let prev = changedBoard[i][j].obj;
  swapObj(changedBoard, x, y, i, j);
  let len = check(i, j, changedBoard, true, curState.color);
  swapObj(changedBoard, i, j, x, y);
  changedBoard[i][j].obj = prev;
  return len;
}

function swapObj(changedBoard, x, y, i, j) {
  let temp = changedBoard[x][y].obj;
  changedBoard[x][y].obj = null;
  changedBoard[i][j].obj = temp;
}

export default class King {
  constructor(color, img) {
    this.color = color;
    this.coin = "king";
    this.img = img;
    this.moved = false;
  }

  move(x, y, movements, board) {
    const curState = this.color === "white" ? whiteState : blackState;
    let changedBoard = new Array();
    pushEl(board, changedBoard);
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        let lx = x + i,
          ly = y + j;
        if (lx < 0 || lx >= board.length || ly < 0 || ly >= board.length)
          continue;
        if ((lx === x && ly === y) || board[lx][ly].obj?.color === this.color)
          continue;
        let checkEl = canMove(x, y, lx, ly, changedBoard, curState);
        if (checkEl) continue;
        if (board[lx][ly].obj && board[lx][ly].obj.color !== this.color)
          movements.push({ x: lx, y: ly, enemy: true });
        else movements.push({ x: lx, y: ly });
      }
    }
    if (!this.moved) {
      if (this.color === "white" && !whiteState.check) {
        if (
          !board[7][3].obj &&
          !board[7][2].obj &&
          !board[7][1].obj &&
          board[7][0].obj &&
          board[7][0].obj.moved === false
        ) {
          if (
            movements.some((obj) => obj.x === 7 && obj.y === 3) &&
            !canMove(x, y, 7, 2, changedBoard, curState)
          )
            movements.push({
              x: 7,
              y: 2,
              castling: true,
              rookObj: { rx: 7, ry: 0 },
              to: { x: 7, y: 3 },
            });
        }
        if (
          !board[7][5].obj &&
          !board[7][6].obj &&
          board[7][7].obj &&
          board[7][7].obj.moved === false
        ) {
          if (
            movements.some((obj) => obj.x === 7 && obj.y === 5) &&
            !canMove(x, y, 7, 6, changedBoard, curState)
          )
            movements.push({
              x: 7,
              y: 6,
              castling: true,
              rookObj: { rx: 7, ry: 7 },
              to: { x: 7, y: 5 },
            });
        }
      }
      if (this.color === "black" && !blackState.check) {
        if (
          !board[0][3].obj &&
          !board[0][2].obj &&
          !board[0][1].obj &&
          board[0][0].obj &&
          board[0][0].obj.moved === false
        ) {
          if (
            movements.some((obj) => obj.x === 0 && obj.y === 3) &&
            !canMove(x, y, 0, 2, changedBoard, curState)
          )
            movements.push({
              x: 0,
              y: 2,
              castling: true,
              rookObj: { rx: 0, ry: 0 },
              to: { x: 0, y: 3 },
            });
        }
        if (
          !board[0][5].obj &&
          !board[0][6].obj &&
          board[0][7].obj &&
          board[0][7].obj.moved === false
        ) {
          if (
            movements.some((obj) => obj.x === 0 && obj.y === 5) &&
            !canMove(x, y, 0, 6, changedBoard, curState)
          )
            movements.push({
              x: 0,
              y: 6,
              castling: true,
              rookObj: { rx: 0, ry: 7 },
              to: { x: 0, y: 5 },
            });
        }
      }
    }
  }

  changed() {
    this.moved = true;
  }

  checkKing(x, y, board) {
    check(x, y, board);
  }
}
