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

export function diagonalMove(x, y, movements, board, curColor) {
  let i = x - 1,
    j = y - 1;
  const curState = curColor === "white" ? whiteState : blackState;
  let changedBoard = new Array();
  pushEl(board, changedBoard);
  while (i >= 0 && j >= 0) {
    if (board[i][j].obj != null && board[i][j].obj.color === curColor) break;
    if (!canMove(x, y, i, j, changedBoard, curState)) {
      if (board[i][j].obj === null) movements.push({ x: i, y: j });
      else if (board[i][j].obj.color != curColor) {
        movements.push({ x: i, y: j, enemy: true });
        break;
      }
    }
    if (board[i][j].obj !== null && board[i][j].obj.color !== curColor) break;
    i--;
    j--;
  }
  i = x + 1;
  j = y + 1;
  while (i < board.length && j < board.length) {
    if (board[i][j].obj != null && board[i][j].obj.color == curColor) break;
    if (!canMove(x, y, i, j, changedBoard, curState)) {
      if (board[i][j].obj === null) movements.push({ x: i, y: j });
      else if (board[i][j].obj.color != curColor) {
        movements.push({ x: i, y: j, enemy: true });
        break;
      }
    }
    if (board[i][j].obj !== null && board[i][j].obj.color !== curColor) break;
    i++;
    j++;
  }

  i = x + 1;
  j = y - 1;
  while (i < board.length && j >= 0) {
    if (board[i][j].obj != null && board[i][j].obj.color == curColor) break;
    if (!canMove(x, y, i, j, changedBoard, curState)) {
      if (board[i][j].obj === null) movements.push({ x: i, y: j });
      else if (board[i][j].obj.color != curColor) {
        movements.push({ x: i, y: j, enemy: true });
        break;
      }
    }
    if (board[i][j].obj !== null && board[i][j].obj.color !== curColor) break;
    i++;
    j--;
  }

  i = x - 1;
  j = y + 1;
  while (i >= 0 && j < board.length) {
    if (board[i][j].obj != null && board[i][j].obj.color == curColor) break;
    if (!canMove(x, y, i, j, changedBoard, curState)) {
      if (board[i][j].obj === null) movements.push({ x: i, y: j });
      else if (board[i][j].obj.color != curColor) {
        movements.push({ x: i, y: j, enemy: true });
        break;
      }
    }
    if (board[i][j].obj !== null && board[i][j].obj.color !== curColor) break;
    i--;
    j++;
  }
}

export function straightMove(x, y, movements, board, curColor) {
  let i = x + 1;
  let j = y;
  const curState = curColor === "white" ? whiteState : blackState;
  let changedBoard = new Array();
  pushEl(board, changedBoard);
  while (i < board.length) {
    if (board[i][j].obj != null && board[i][j].obj.color === curColor) break;
    if (!canMove(x, y, i, j, changedBoard, curState)) {
      if (board[i][j].obj === null) movements.push({ x: i, y: j });
      else if (board[i][j].obj.color != curColor) {
        movements.push({ x: i, y: j, enemy: true });
        break;
      }
    }
    if (board[i][j].obj !== null && board[i][j].obj.color !== curColor) break;
    i++;
  }

  i = x - 1;
  while (i >= 0) {
    if (board[i][j].obj !== null && board[i][j].obj.color === curColor) break;
    if (!canMove(x, y, i, j, changedBoard, curState)) {
      if (board[i][j].obj === null) movements.push({ x: i, y: j });
      else if (board[i][j].obj.color !== curColor) {
        movements.push({ x: i, y: j, enemy: true });
        break;
      }
    }
    if (board[i][j].obj !== null && board[i][j].obj.color !== curColor) break;
    i--;
  }

  i = x;
  j = y - 1;
  while (j >= 0) {
    if (board[i][j].obj !== null && board[i][j].obj.color === curColor) break;
    if (!canMove(x, y, i, j, changedBoard, curState)) {
      if (board[i][j].obj === null) movements.push({ x: i, y: j });
      else if (board[i][j].obj.color !== curColor) {
        movements.push({ x: i, y: j, enemy: true });
        break;
      }
    }
    if (board[i][j].obj !== null && board[i][j].obj.color !== curColor) break;
    j--;
  }
  i = x;
  j = y + 1;
  while (j < board.length) {
    if (board[i][j].obj !== null && board[i][j].obj.color === curColor) break;
    if (!canMove(x, y, i, j, changedBoard, curState)) {
      if (board[i][j].obj === null) movements.push({ x: i, y: j });
      else if (board[i][j].obj.color !== curColor) {
        movements.push({ x: i, y: j, enemy: true });
        break;
      }
    }
    if (board[i][j].obj !== null && board[i][j].obj.color !== curColor) break;
    j++;
  }
}

export function knightMove(x, y, movements, board, color) {
  let directions = [
    { x: x - 1, y: y + 2 },
    { x: x + 1, y: y + 2 },
    { x: x - 1, y: y - 2 },
    { x: x + 1, y: y - 2 },
    { x: x - 2, y: y + 1 },
    { x: x + 2, y: y + 1 },
    { x: x - 2, y: y - 1 },
    { x: x + 2, y: y - 1 },
  ];
  const curState = color === "white" ? whiteState : blackState;
  let changedBoard = new Array();
  pushEl(board, changedBoard);
  for (let i = 0; i < directions.length; i++) {
    let lx = directions[i].x;
    let ly = directions[i].y;
    if (lx < 0 || lx >= board.length || ly < 0 || ly >= board.length) continue;
    if (!canMove(x, y, lx, ly, changedBoard, curState)) {
      if (board[lx][ly].obj === null) movements.push({ x: lx, y: ly });
      else if (board[lx][ly].obj.color !== color)
        movements.push({ x: lx, y: ly, enemy: true });
    }
  }
}
