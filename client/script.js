import tile from "./tile.js";
import { whiteState, blackState } from "./kingState.js";
import BotBuilder from "./Bot.js";
import {
  changePawn,
  animateCoin,
  displayMessage,
  clearAvailbleMovesTiles,
  availbleMovesTiles,
  removeTargetTile,
  targetTile,
  getMovements,
  clearTileClassName,
  addTileClassName,
  renderBoard,
  setTile,
  clearTile,
  displayBoard,
} from "./utils.js";
import queen from "./queen.js";
import rook from "./pawn.js";
import bishop from "./bishop.js";
import knight from "./pawn.js";

const game = document.querySelector(".game-container");
const board_con = document.querySelector(".board-container");

const size = 8;
let board = [];
let bot_game = true;
let currentPlayer = "white";
let player = "white";
let val = false;
let selected = false;
let currentPos = [null, null];
let movements = [];
let checkMate = false;
let game_over = false;
let timer;
let lastSelected = [];
let score = [0, 0];
let bot = null;
let totalMoves = 0;
let size_ = Math.min(board_con.scrollWidth / 8, board_con.scrollHeight / 8);
const r = document.querySelector(":root");
const close_btn = document.querySelectorAll(".close");
const restart_btn = document.querySelector(".restart-btn");
let moveLists = document.querySelector(".moves-list");
let player1 = document.querySelector(".player1");
let player2 = document.querySelector(".player2");
let score1 = document.querySelector(".score1");
let score2 = document.querySelector(".score2");

let min = 3;
let sec = 0;

let whiteTime = { min: min, sec: sec };
let blackTime = { min: min, sec: sec };

r.style.setProperty("--size", size_ + "px");

function stateChange(i, j, lx, ly) {
  selected = false;
  currentPlayer = currentPlayer === "white" ? "black" : "white";
  movements = [];
  lastSelected.forEach((el) => {
    clearTileClassName(board, el.i, el.j);
  });
  lastSelected = [
    { i: lx, j: ly },
    { i, j },
  ];
  lastSelected.forEach((el) => {
    addTileClassName(board, el.i, el.j);
  });
}

function initStates() {
  lastSelected = [];
  currentPlayer = "white";
  player = "white";
  val = false;
  selected = false;
  currentPos = [null, null];
  movements = [];
  checkMate = false;
  game_over = false;
  whiteTime.min = min;
  whiteTime.sec = sec;
  blackTime.min = min;
  blackTime.sec = sec;
  totalMoves = 0;
  whiteState.pos = { x: 7, y: 4 };
  whiteState.check = false;
  whiteState.checkPos = null;
  blackState.pos = { x: 0, y: 4 };
  blackState.check = false;
  blackState.checkPos = null;
  moveLists.innerHTML = "";
  player = !bot_game ? "white" : player;
  bot = new BotBuilder(player == "white" ? "black" : "white");

  if (bot_game) {
    player1.textContent = player == "white" ? "player" : "computer";
    player2.textContent = player != "white" ? "player" : "computer";
  } else {
    player1.textContent = "player1";
    player2.textContent = "player2";
  }

  score1.textContent = score[0];
  score2.textContent = score[1];
}

function updateGameBoard() {
  const a = [
    [0, 0, "rook", "black"],
    [0, 1, "knight", "black"],
    [0, 2, "bishop", "black"],
    [0, 3, "queen", "black"],
    [0, 4, "king", "black"],
    [0, 5, "bishop", "black"],
    [0, 6, "knight", "black"],
    [0, 7, "rook", "black"],
    [7, 0, "rook", "white"],
    [7, 1, "knight", "white"],
    [7, 2, "bishop", "white"],
    [7, 3, "queen", "white"],
    [7, 4, "king", "white"],
    [7, 5, "bishop", "white"],
    [7, 6, "knight", "white"],
    [7, 7, "rook", "white"],
  ];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      board[i][j].obj = null;
      let d = board[i][j].div;
      d.classList.remove("selected");
      d.classList.remove("red-available");
    }
  }

  for (let i = 0; i < 8; i++) {
    board[1][i].update("pawn", "black");
    board[6][i].update("pawn", "white");
  }

  for (let i = 0; i < a.length; i++) {
    board[a[i][0]][a[i][1]].update(a[i][2], a[i][3]);
  }

  if (player == "black") {
    r.style.setProperty("--textBrown", "#b68863");
    r.style.setProperty("--textWhite", "#f0d9b5");
  }
  for (let i = 0; i < size; i++) {
    if (player == "white") {
      board[i][0].div.classList.add(`_${size - i}`);
      board[size - 1][i].div.classList.add(`_${String.fromCharCode(97 + i)}`);
    } else {
      board[0][i].div.classList.add(`_${String.fromCharCode(97 + i)}`);
      board[i][size - 1].div.classList.add(`_${size - i}`);
    }
  }
  displayBoard(board, player);
}

function init() {
  initStates();
  for (let i = 0; i < size; i++) {
    board.push([]);
    for (let j = 0; j < size; j++) {
      let tileEl = new tile(i, j, val ? "green" : "white");
      board[i].push(tileEl);
      val = !val;
    }
    val = !val;
  }

  updateGameBoard();
}

init();

function selectSameTile(board, i, j, x, y) {
  if (i == x && j == y) {
    currentPos = [null, null];
    selected = false;
    clearAvailbleMovesTiles(board, movements);
    movements = [];
    clearTileClassName(board, i, j);
    return true;
  }
  return false;
}

function findAnyMove(board, color) {
  let movements = [];
  board.forEach((b) => {
    b.forEach((el) => {
      if (movements.length) return;
      if (el.obj && el.obj.color === color) {
        el.obj.move(el.x, el.y, movements, board);
      }
    });
  });
  return movements;
}

function selectAlternatePiece(board, i, j, x, y) {
  if (board[i][j].obj && board[i][j].obj.color === currentPlayer) {
    addTileClassName(board, i, j);
    clearTileClassName(board, x, y);
    clearAvailbleMovesTiles(board, movements);
    movements = [];
    currentPos = [i, j];
    movements = getMovements(board, i, j);
    availbleMovesTiles(board, movements);
    return true;
  }
  return false;
}

function detectCheck(board) {
  board[whiteState.pos.x][whiteState.pos.y].obj?.checkKing(
    whiteState.pos.x,
    whiteState.pos.y,
    board
  );
  board[blackState.pos.x][blackState.pos.y].obj?.checkKing(
    blackState.pos.x,
    blackState.pos.y,
    board
  );

  if (whiteState.check || blackState.check) {
    const c = blackState.check ? "BLACK" : "WHITE";
    const check_king = blackState.check ? blackState : whiteState;
    targetTile(board, check_king.pos.x, check_king.pos.y);
  }
}

function detectCheckMate(board) {
  if (whiteState.check || blackState.check) {
    const c = blackState.check ? "BLACK" : "WHITE";

    let movements = findAnyMove(board, c.toLocaleLowerCase());
    let targets = movements.length;
    movements = [];
    if (!targets) {
      checkMate = true;
      c === "BLACK" ? score[0]++ : score[1]++;

      displayMessage(c === "BLACK" ? "WHITE" : c);
      clearInterval(timer);
      return;
    }
  }
}

function giveMoveString(i, j, x, y) {
  i = Math.abs(8 - (i + 1)) + 1;
  j = String.fromCharCode(97 + j);
  y = String.fromCharCode(97 + y);
  x = Math.abs(8 - (x + 1)) + 1;
  return y + "" + x + " => " + j + "" + i;
}
function appendCurrentMove(i, j, x, y) {
  const move = document.createElement("div");
  move.classList.add("move");
  if (totalMoves % 2 != 0) move.classList.add("alt");
  move.textContent = giveMoveString(i, j, x, y);
  moveLists.appendChild(move);
  totalMoves++;
  moveLists.scrollTop = moveLists.scrollHeight;
}

async function movePiece(board, i, j, x, y) {
  animateCoin(board, i, j, x, y);
  if (board[i][j].obj) {
    const img = board[i][j].div.querySelector(".images");
    img.classList.remove("delete");
    img.classList.remove("images");
    img.classList.add("deleted-piece");
  }
  clearTileClassName(board, x, y);
  setTile(board, i, j, x, y);
  clearTile(board, x, y);
  appendCurrentMove(i, j, x, y);
  stateChange(i, j, x, y);
  await renderBoard(board, i, j, x, y);
}

function onKingMove(board, i, j, x, y) {
  if (board[x][y].obj.changed) {
    board[x][y].obj.changed();
    if (board[x][y].obj.coin === "king")
      board[x][y].obj.color === "white"
        ? (whiteState.pos = { x: i, y: j })
        : (blackState.pos = { x: i, y: j });
  }
}

async function onCastling(board, canMove) {
  if (canMove.castling) {
    let tx = canMove.to.x;
    let ty = canMove.to.y;
    let rx = canMove.rookObj.rx;
    let ry = canMove.rookObj.ry;
    animateCoin(board, tx, ty, rx, ry);
    clearTileClassName(board, rx, ry);
    setTile(board, tx, ty, rx, ry);
    clearTile(board, rx, ry);
    await renderBoard(board, tx, ty, rx, ry);
  }
}

function botPawnChange(board, x, y, changeTo) {
  if (board[x][y].obj.coin != "pawn") return;
  let obj = board[x][y].obj;
  if (changeTo == "queen") obj = new queen(obj.color);
  if (changeTo == "rook") obj = new rook(obj.color);
  if (changeTo == "knight") obj = new knight(obj.color);
  if (changeTo == "bishop") obj = new bishop(obj.color);
  board[x][y].obj = obj;
}

async function clickHandler(i, j) {
  if (bot_game && currentPlayer != player) return;
  if (checkMate || game_over) return;
  const lx = currentPos[0];
  const ly = currentPos[1];
  let color;
  if (!selected) {
    if (!board[i][j].obj) return;
    color = board[i][j].obj.color;
    if (board[i][j].obj && currentPlayer !== color) return;

    currentPos = [i, j];
    addTileClassName(board, i, j);
    selected = true;
    movements = getMovements(board, i, j);
    availbleMovesTiles(board, movements);
    return;
  }
  if (selected) {
    if (selectSameTile(board, i, j, lx, ly)) return;
    clearAvailbleMovesTiles(board, movements);
    if (selectAlternatePiece(board, i, j, lx, ly)) return;

    let canMove = movements.find((el) => el.x === i && el.y === j);
    if (!canMove) {
      availbleMovesTiles(board, movements);
      return;
    }
    removeTargetTile(board, whiteState.pos.x, whiteState.pos.y);
    removeTargetTile(board, blackState.pos.x, blackState.pos.y);
    onKingMove(board, i, j, lx, ly);
    await onCastling(board, canMove);
    await movePiece(board, i, j, lx, ly);
    console.log(canMove);

    if (canMove.changeTo !== undefined) {
      console.log(canMove);
      let pieceColor = board[i][j].obj.color;
      await changePawn(board, pieceColor, i, j);
    }
  }
  detectCheck(board);
  detectCheckMate(board);
}

async function botMove() {
  const moves = bot.move(board);
  const { x, y, i, j } = moves;
  onKingMove(board, x, y, i, j);
  await onCastling(board, moves);
  movePiece(board, x, y, i, j);
  if (moves.changeTo !== undefined) {
    botPawnChange(board, x, y, moves.changeTo);
  }
  detectCheck(board);
  detectCheckMate(board);
}

async function boardHandler(board) {
  if (currentPlayer === bot.color) {
    botMove();
  }
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      board[i][j].div.addEventListener("click", async function (e) {
        await clickHandler(i, j);
        if (bot_game && currentPlayer === bot.color) {
          botMove();
        }

        for (let k = 0; k < board.length; k++) {
          for (let l = 0; l < board[i].length; l++) {
            let obj = board[k][l].obj;
            if (obj?.coin === "king") {
              if (obj.color === "black") {
                blackState.pos = { x: k, y: l };
              } else {
                whiteState.pos = { x: k, y: l };
              }
            }
          }
        }
      });
    }
  }
}
boardHandler(board);

function showTime() {
  const blackTimer = document.querySelector(".black-timer");
  const whiteTimer = document.querySelector(".white-timer");
  whiteTimer.innerHTML =
    (whiteTime.min < 10 ? "0" + whiteTime.min : whiteTime.min) +
    ":" +
    (whiteTime.sec < 10 ? "0" + whiteTime.sec : whiteTime.sec);
  blackTimer.innerHTML =
    (blackTime.min < 10 ? "0" + blackTime.min : blackTime.min) +
    ":" +
    (blackTime.sec < 10 ? "0" + blackTime.sec : blackTime.sec);

  if (currentPlayer === "white") {
    whiteTimer.classList.add("active");
    blackTimer.classList.remove("active");
    player1.classList.add("active");
    player2.classList.remove("active");
  } else {
    blackTimer.classList.add("active");
    whiteTimer.classList.remove("active");
    player2.classList.add("active");
    player1.classList.remove("active");
  }
}

function timeInterval() {
  showTime();
  timer = setInterval(() => {
    if (currentPlayer === "white") {
      timeReducer(whiteTime);
    } else timeReducer(blackTime);
    if (game_over) {
      currentPlayer = "";
      return;
    }
    showTime();
  }, 1000);
}

timeInterval();

function timeReducer(obj) {
  if (obj.sec === 0) {
    obj.min--;
    if (obj.min < 0) {
      game_over = true;
      displayMessage(currentPlayer === "black" ? "WHITE" : "BLACK");
      clearInterval(timer);
      return;
    }
    obj.sec = 60;
  }
  obj.sec--;
}

function closeMessage() {
  const alert = document.querySelector(".alert");
  alert.style.display = "none";
}

close_btn.forEach((el) => {
  el.addEventListener("click", () => {
    closeMessage();
  });
});

function restart() {
  clearInterval(timer);
  initStates();
  updateGameBoard();
  closeMessage();
  timeInterval();
  if (bot_game && currentPlayer === bot.color) {
    botMove();
  }
}

restart_btn.addEventListener("click", () => {
  restart();
});

const play_btn = document.querySelector(".play-btn");

play_btn.addEventListener("click", () => {
  bot_game = !bot_game;
  play_btn.textContent = bot_game ? "Play Training" : "Play Computer";
  restart();
});

const re_button = document.querySelector(".restart-button");

re_button.addEventListener("click", () => {
  restart();
});
