import tile from "./tile.js";
import { whiteState, blackState } from "./kingState.js";

const game = document.querySelector(".game-container");
const board_con = document.querySelector(".board-container");

const size = 8;
let board = [];
let currentPlayer = "white";
let val = false;
let selected = false;
let currentPos = [null, null];
let movements = [];
let checkMate = false;
let game_over = false;
let timer;
let lastSelected = [];
let score = [0, 0];
let size_ = Math.min(board_con.scrollWidth / 8, board_con.scrollHeight / 8);
const r = document.querySelector(":root");
const close_btn = document.querySelectorAll(".close");
const restart_btn = document.querySelector(".restart-btn");

let min = 3;
let sec = 0;

let whiteTime = { min: min, sec: sec };
let blackTime = { min: min, sec: sec };

r.style.setProperty("--size", size_ + "px");
board_con.style.height = size_ * 8 + "px";

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

function init() {
  board = [];
  lastSelected = [];
  currentPlayer = "white";
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
  whiteState.pos = { x: 7, y: 4 };
  whiteState.check = false;
  whiteState.checkPos = null;
  blackState.pos = { x: 0, y: 4 };
  blackState.check = false;
  blackState.checkPos = null;

  for (let i = 0; i < size; i++) {
    board.push([]);
    for (let j = 0; j < size; j++) {
      let tileEl = new tile(
        i,
        j,
        i == 1 ? "BlackPawn.png" : i == 6 ? "WhitePawn.png" : "",
        i == 0 || i == 1 ? "black" : i == 6 || i == 7 ? "white" : "",
        i == 1 || i == 6 ? "pawn" : "",
        val ? "green" : "white"
      );
      board[i].push(tileEl);
      val = !val;
    }
    val = !val;
  }

  const a = [
    [0, 0, "rook", "black", "BlackRook.png"],
    [0, 1, "knight", "black", "BlackKnight.png"],
    [0, 2, "bishop", "black", "BlackBishop.png"],
    [0, 3, "queen", "black", "BlackQueen.png"],
    [0, 4, "king", "black", "BlackKing.png"],
    [0, 5, "bishop", "black", "BlackBishop.png"],
    [0, 6, "knight", "black", "BlackKnight.png"],
    [0, 7, "rook", "black", "BlackRook.png"],
    [7, 0, "rook", "white", "WhiteRook.png"],
    [7, 1, "knight", "white", "WhiteKnight.png"],
    [7, 2, "bishop", "white", "WhiteBishop.png"],
    [7, 3, "queen", "white", "WhiteQueen.png"],
    [7, 4, "king", "white", "WhiteKing.png"],
    [7, 5, "bishop", "white", "WhiteBishop.png"],
    [7, 6, "knight", "white", "WhiteKnight.png"],
    [7, 7, "rook", "white", "WhiteRook.png"],
  ];

  for (let i = 0; i < a.length; i++) {
    board[a[i][0]][a[i][1]].update(a[i][2], a[i][3], a[i][4]);
  }

  displayBoard(board);
}

init();

function displayBoard(board) {
  let gameBoard = game.querySelector(".board");
  gameBoard.innerHTML = "";
  board.map((b) => {
    b.map((el) => {
      el.div.innerHTML = "";
      gameBoard.appendChild(el.div);
      var i_cont = document.createElement("div");
      i_cont.classList.add("i-cont");
      var i = document.createElement("img");
      val = !val;

      if (el.obj) {
        i.src = "./img/" + el.obj?.img;
        i.setAttribute("class", "images");
        el.div.appendChild(i_cont);
        i_cont.appendChild(i);
      }
    });
  });
}

function clearTile(board, i, j) {
  board[i][j].obj = null;
}

function setTile(board, i, j, x, y) {
  board[i][j].obj = board[x][y].obj;
}

function renderBoard(board, i, j, lx, ly) {
  setTimeout(() => {
    if (lx !== null && ly !== null) board[lx][ly].div.innerHTML = "";

    board[i][j].div.innerHTML = "";
    var i_cont = document.createElement("div");
    i_cont.classList.add("i-cont");
    var img = document.createElement("img");
    img.src = "./img/" + board[i][j].obj.img;
    img.setAttribute("class", "images");
    board[i][j].div.appendChild(i_cont);
    i_cont.appendChild(img);
  }, 150);
}

function addTileClassName(board, x, y) {
  board[x][y].div.classList.add(
    board[x][y].className === "green" ? "green-selected" : "white-selected"
  );
}

function clearTileClassName(board, x, y) {
  board[x][y].div.classList.remove(
    board[x][y].className === "green" ? "green-selected" : "white-selected"
  );
}

function getMovements(x, y) {
  board[x][y].obj.move(x, y, movements, board);
}

function targetTile(x, y) {
  const enemy = document.createElement("div");
  enemy.classList.add("red-available");
  board[x][y].div.appendChild(enemy);
}

function removeTargetTile(x, y) {
  board[x][y].div.querySelector(".red-available")?.remove();
}

function availbleMovesTiles() {
  for (let i = 0; i < movements.length; i++) {
    let x = movements[i].x;
    let y = movements[i].y;
    if (movements[i].enemy) {
      targetTile(x, y);
      continue;
    }
    board[x][y].div.classList.add(
      board[x][y].className === "green" ? "green-available" : "white-available"
    );
  }
}

function clearAvailbleMovesTiles() {
  for (let i = 0; i < movements.length; i++) {
    let x = movements[i].x;
    let y = movements[i].y;
    if (movements[i].enemy) {
      removeTargetTile(x, y);
      continue;
    }
    board[x][y].div.classList.remove(
      board[x][y].className === "green" ? "green-available" : "white-available"
    );
  }
}

function displayMessage(color) {
  const alert = document.querySelector(".alert");
  alert.style.display = "flex";
  const p_elem = alert.querySelector(".won-player");
  p_elem.textContent = color.toLocaleUpperCase() + " WINS";
  const scores = alert.querySelector(".score");
  scores.innerHTML = score[0] + "-" + score[1];
}

function animateCoin(board, i, j, lx, ly) {
  var elem = board[lx][ly].div;

  var img = elem.querySelector(".i-cont");
  img.style.zIndex = 100;
  var current = board[i][j].div;
  const x_p = elem.offsetWidth / 2 - img.offsetWidth / 2;
  const y_p = elem.offsetHeight / 2 - img.offsetHeight / 2;

  img.style.left = current.offsetLeft - elem.offsetLeft + x_p / 2 + "px";
  img.style.top = current.offsetTop - elem.offsetTop + y_p / 2 + "px";

  if (board[i][j].obj) {
    var el = current.querySelector(".i-cont");
    el.classList.add("delete");
  }
}

async function changePawn(color, x, y) {
  let waitForPressResolve;
  let check_alert = document.createElement("div");
  check_alert.classList.add("alert");
  check_alert.style.display = "flex";
  document.body.appendChild(check_alert);
  ["Queen.png", "Rook.png", "Knight.png", "Bishop.png"].forEach((el) => {
    let change_piece = document.createElement("img");
    change_piece.classList.add("pieces");
    let imgVal = color + el;
    change_piece.src = "./img/" + imgVal;
    check_alert.appendChild(change_piece);
    change_piece.addEventListener("click", () => {
      let piece = el.toLocaleLowerCase().split(".")[0];
      board[x][y].update(piece, color.toLocaleLowerCase(), imgVal);
      renderBoard(board, x, y, x, y);
      check_alert.remove();
      if (waitForPressResolve) waitForPressResolve();
    });
  });

  return new Promise((resolve) => (waitForPressResolve = resolve));
}

async function boardHandler(board) {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      board[i][j].div.addEventListener("click", async function (e) {
        if (checkMate || game_over) return;
        const lx = currentPos[0];
        const ly = currentPos[1];
        let color;
        if (!selected) {
          // if (lx != null) clearTileClassName(board, lx, ly);
          if (!board[i][j].obj) return;
          color = board[i][j].obj.color;
          if (board[i][j].obj && currentPlayer !== color) return;

          currentPos = [i, j];
          addTileClassName(board, i, j);
          selected = true;

          board[whiteState.pos.x][whiteState.pos.y].obj.checkKing(
            whiteState.pos.x,
            whiteState.pos.y,
            board
          );
          board[blackState.pos.x][blackState.pos.y].obj.checkKing(
            blackState.pos.x,
            blackState.pos.y,
            board
          );
          getMovements(i, j);
          availbleMovesTiles();
          return;
        }

        if (selected) {
          if (i == lx && j == ly) {
            currentPos = [null, null];
            selected = false;
            clearAvailbleMovesTiles();
            movements = [];
            clearTileClassName(board, i, j);
            return;
          }
          clearAvailbleMovesTiles();
          if (board[i][j].obj && board[i][j].obj.color === currentPlayer) {
            addTileClassName(board, i, j);
            clearTileClassName(board, lx, ly);
            clearAvailbleMovesTiles();
            movements = [];
            currentPos = [i, j];
            getMovements(i, j);
            availbleMovesTiles();
          }

          let canMove = movements.find((el) => el.x === i && el.y === j);
          if (!canMove) {
            availbleMovesTiles();
            return;
          }
          removeTargetTile(whiteState.pos.x, whiteState.pos.y);
          removeTargetTile(blackState.pos.x, blackState.pos.y);
          if (board[lx][ly].obj.changed) {
            board[lx][ly].obj.changed();
            if (board[lx][ly].obj.coin === "king")
              board[lx][ly].obj.color === "white"
                ? (whiteState.pos = { x: i, y: j })
                : (blackState.pos = { x: i, y: j });
          }
          if (canMove.castling) {
            let tx = canMove.to.x;
            let ty = canMove.to.y;
            let rx = canMove.rookObj.rx;
            let ry = canMove.rookObj.ry;
            animateCoin(board, tx, ty, rx, ry);
            clearTileClassName(board, rx, ry);
            setTile(board, tx, ty, rx, ry);
            clearTile(board, rx, ry);
            renderBoard(board, tx, ty, rx, ry);
          }

          for (let k = 0; k < board.length; k++) {
            if (board[0][k].obj && board[0][k].obj.coin === "pawn") {
              await changePawn("White", 0, k);
              break;
            }
            if (board[7][k].obj && board[7][k].obj.coin === "pawn") {
              await changePawn("Black", 7, k);
              break;
            }
          }
          animateCoin(board, i, j, lx, ly);
          if (board[i][j].obj) {
            const img = board[i][j].div.querySelector(".images");
            img.classList.remove("delete");
            img.classList.remove("images");
            img.classList.add("deleted-piece");
          }
          clearTileClassName(board, lx, ly);
          setTile(board, i, j, lx, ly);
          clearTile(board, lx, ly);
          renderBoard(board, i, j, lx, ly);
        }
        board[whiteState.pos.x][whiteState.pos.y].obj.checkKing(
          whiteState.pos.x,
          whiteState.pos.y,
          board
        );
        board[blackState.pos.x][blackState.pos.y].obj.checkKing(
          blackState.pos.x,
          blackState.pos.y,
          board
        );
        stateChange(i, j, lx, ly);

        if (whiteState.check || blackState.check) {
          const c = blackState.check ? "BLACK" : "WHITE";
          const check_king = blackState.check ? blackState : whiteState;
          if (c == "BLACK") {
            targetTile(blackState.pos.x, blackState.pos.y);
          } else {
            targetTile(whiteState.pos.x, whiteState.pos.y);
          }
          check_king.pos;
          board.forEach((b) => {
            b.forEach((el) => {
              if (movements.length) return;
              if (el.obj && el.obj.color === c.toLocaleLowerCase()) {
                el.obj.move(el.x, el.y, movements, board);
              }
            });
          });
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
      });
    }
  }
}
boardHandler(board);
const black_timer = document.querySelector(".black-timer");
const white_timer = document.querySelector(".white-timer");
white_timer.innerHTML =
  whiteTime.min + ":" + (whiteTime.sec < 10 ? "0" : "") + whiteTime.sec;
black_timer.innerHTML =
  blackTime.min + ":" + (blackTime.sec < 10 ? "0" : "") + blackTime.sec;

function timeInterval() {
  timer = setInterval(() => {
    if (currentPlayer === "white") {
      timeReducer(whiteTime);
    } else timeReducer(blackTime);
    if (game_over) {
      currentPlayer = "";

      return;
    }
    white_timer.innerHTML =
      whiteTime.min + ":" + (whiteTime.sec < 10 ? "0" : "") + whiteTime.sec;
    black_timer.innerHTML =
      blackTime.min + ":" + (blackTime.sec < 10 ? "0" : "") + blackTime.sec;
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

restart_btn.addEventListener("click", () => {
  clearInterval(timer);
  init();
  displayBoard(board);
  closeMessage();
  boardHandler(board);
  timeInterval();
});
