import { whiteState, blackState } from "./kingState.js";
import { check } from "./check.js";

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
  let len = check(curState.pos.x, curState.pos.y, changedBoard, true);
  swapObj(changedBoard, i, j, x, y);
  changedBoard[i][j].obj = prev;
  return len;
}

function swapObj(changedBoard, x, y, i, j) {
  let temp = changedBoard[x][y].obj;
  changedBoard[x][y].obj = null;
  changedBoard[i][j].obj = temp;
}

export default class Pawn {
  constructor(color, img) {
    this.color = color;
    this.coin = "pawn";
    this.img = img;
  }

  move(x, y, movements, board) {
    const curState = this.color === "white" ? whiteState : blackState;
    let changedBoard = new Array();
    pushEl(board, changedBoard);
    if (this.color === "white") {
      if (x === 6) {
        for (let i = 1; i <= 2; i++) {
          if (!canMove(x, y, x - i, y, changedBoard, curState)) {
            if (board[x - i][y].obj === null)
              movements.push({ x: x - i, y: y });
            else break;
          } else break;
        }
      } else {
        if (x - 1 >= 0 && !canMove(x, y, x - 1, y, changedBoard, curState)) {
          if (!board[x - 1][y].obj) movements.push({ x: x - 1, y: y });
        }
      }
      if (
        x - 1 >= 0 &&
        y - 1 >= 0 &&
        board[x - 1][y - 1].obj &&
        board[x - 1][y - 1].obj.color !== this.color
      ) {
        if (!canMove(x, y, x - 1, y - 1, changedBoard, curState)) {
          movements.push({ x: x - 1, y: y - 1, enemy: true });
        }
      }

      if (
        x - 1 >= 0 &&
        y + 1 < board.length &&
        board[x - 1][y + 1].obj &&
        board[x - 1][y + 1].obj.color !== this.color
      ) {
        if (!canMove(x, y, x - 1, y + 1, changedBoard, curState)) {
          movements.push({ x: x - 1, y: y + 1, enemy: true });
        }
      }
    }

    if (this.color === "black") {
      if (x == 1) {
        for (let i = 1; i <= 2; i++) {
          if (!canMove(x, y, x + i, y, changedBoard, curState)) {
            if (!board[x + i][y].obj) movements.push({ x: x + i, y: y });
            else break;
          } else break;
        }
      } else {
        if (
          x + 1 < board.length &&
          !canMove(x, y, x + 1, y, changedBoard, curState)
        ) {
          if (!board[x + 1][y].obj) movements.push({ x: x + 1, y: y });
        }
      }
      if (
        x + 1 < board.length &&
        y - 1 >= 0 &&
        board[x + 1][y - 1].obj &&
        board[x + 1][y - 1].obj.color !== this.color
      ) {
        if (!canMove(x, y, x + 1, y - 1, changedBoard, curState)) {
          movements.push({ x: x + 1, y: y - 1, enemy: true });
        }
      }
      if (
        x + 1 < board.length &&
        y + 1 < board.length &&
        board[x + 1][y + 1].obj &&
        board[x + 1][y + 1].obj.color !== this.color
      ) {
        if (!canMove(x, y, x + 1, y + 1, changedBoard, curState)) {
          movements.push({ x: x + 1, y: y + 1, enemy: true });
        }
      }
    }
  }
}
