import { whiteState, blackState } from "./kingState.js";

function checkHelper(x, y, board, movements, color, coins) {
  if (board[x][y].obj && board[x][y].obj.color === color) return true;
  if (board[x][y].obj && board[x][y].obj.color !== color) {
    if (coins.some((c) => c === board[x][y].obj.coin))
      movements.push({ x, y, enemy: true });
    return true;
  }
  return false;
}

export function diagonalMove(x, y, movements, board, color) {
  let i = x - 1,
    j = y - 1;
  while (i >= 0 && j >= 0) {
    if (checkHelper(i, j, board, movements, color, ["queen", "bishop"])) break;
    i--;
    j--;
  }
  i = x + 1;
  j = y + 1;
  while (i < board.length && j < board.length) {
    if (checkHelper(i, j, board, movements, color, ["queen", "bishop"])) break;
    i++;
    j++;
  }

  i = x + 1;
  j = y - 1;
  while (i < board.length && j >= 0) {
    if (checkHelper(i, j, board, movements, color, ["queen", "bishop"])) break;
    i++;
    j--;
  }

  i = x - 1;
  j = y + 1;
  while (i >= 0 && j < board.length) {
    if (checkHelper(i, j, board, movements, color, ["queen", "bishop"])) break;
    i--;
    j++;
  }
}

export function straightMove(x, y, movements, board, color) {
  let i = x + 1;
  let j = y;
  while (i < board.length) {
    if (checkHelper(i, j, board, movements, color, ["queen", "rook"])) break;
    i++;
  }
  i = x - 1;
  while (i >= 0) {
    if (checkHelper(i, j, board, movements, color, ["queen", "rook"])) break;
    i--;
  }

  i = x;
  j = y - 1;
  while (j >= 0) {
    if (checkHelper(i, j, board, movements, color, ["queen", "rook"])) break;
    j--;
  }
  i = x;
  j = y + 1;
  while (j < board.length) {
    if (checkHelper(i, j, board, movements, color, ["queen", "rook"])) break;
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

  for (let i = 0; i < directions.length; i++) {
    let lx = directions[i].x;
    let ly = directions[i].y;
    if (lx < 0 || lx >= board.length || ly < 0 || ly >= board.length) continue;
    checkHelper(lx, ly, board, movements, color, ["knight"]);
  }
}

function pawnMove(x, y, movements, board, color) {
  if (color === "white") {
    if (x - 1 >= 0 && y - 1 >= 0 && board[x - 1][y - 1].obj) {
      if (
        board[x - 1][y - 1].obj.color !== color &&
        board[x - 1][y - 1].obj.coin === "pawn"
      )
        movements.push({ x: x - 1, y: y - 1, enemy: true });
    }
    if (x - 1 >= 0 && y + 1 < board.length && board[x - 1][y + 1].obj) {
      if (
        board[x - 1][y + 1].obj.color !== color &&
        board[x - 1][y + 1].obj.coin === "pawn"
      )
        movements.push({ x: x - 1, y: y + 1, enemy: true });
    }
  } else {
    if (x + 1 < board.length && y - 1 >= 0 && board[x + 1][y - 1].obj) {
      if (
        board[x + 1][y - 1].obj.color !== color &&
        board[x + 1][y - 1].obj.coin === "pawn"
      )
        movements.push({ x: x + 1, y: y - 1, enemy: true });
    }
    if (
      x + 1 < board.length &&
      y + 1 < board.length &&
      board[x + 1][y + 1].obj
    ) {
      if (
        board[x + 1][y + 1].obj.color !== color &&
        board[x + 1][y + 1].obj.coin === "pawn"
      )
        movements.push({ x: x + 1, y: y + 1, enemy: true });
    }
  }
}
function kingMovements(x, y, movements, board, color) {
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (
        i + x <= -1 ||
        y + j <= -1 ||
        x + i >= board.length ||
        y + j >= board.length
      )
        continue;
      const obj = board[x + i][y + j];
      if (obj.obj && obj?.obj.coin === "king" && obj.obj.color !== color) {
        movements.push({ x: x + i, y: y + j });
      }
    }
  }
}
export function check(x, y, board, troops = false, Color) {
  let movements = [];
  let color = Color || board[x][y].obj?.color;
  diagonalMove(x, y, movements, board, color);
  straightMove(x, y, movements, board, color);
  knightMove(x, y, movements, board, color);
  pawnMove(x, y, movements, board, color);
  kingMovements(x, y, movements, board, color);
  if (troops) return movements.length;
  color === "white"
    ? (whiteState.check = movements.length)
    : (blackState.check = movements.length);

  color === "white"
    ? (whiteState.checkPos = movements)
    : (blackState.checkPos = movements);
}
