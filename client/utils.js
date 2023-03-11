function createElementsForBoard(el, gameBoard) {
  el.div.innerHTML = "";
  gameBoard.appendChild(el.div);
  var i_cont = document.createElement("div");
  i_cont.classList.add("i-cont");
  var i = document.createElement("img");
  if (el.obj) {
    i.src = "./img/" + el.obj?.img;
    i.setAttribute("class", "images");
    el.div.appendChild(i_cont);
    i_cont.appendChild(i);
  }
}
export function displayBoard(board, player) {
  let gameBoard = document.querySelector(".board-grid");
  gameBoard.innerHTML = "";
  if (player == "white") {
    board.map((b) => {
      b.map((el) => {
        createElementsForBoard(el, gameBoard);
      });
    });
  } else if (player == "black") {
    for (let i = board.length - 1; i >= 0; i--) {
      for (let j = board.length - 1; j >= 0; j--) {
        createElementsForBoard(board[i][j], gameBoard);
      }
    }
  }
}

export function clearTile(board, i, j) {
  board[i][j].obj = null;
}

export function setTile(board, i, j, x, y) {
  board[i][j].obj = board[x][y].obj;
}

export async function renderBoard(board, i, j, lx, ly) {
  return new Promise((resolve) => {
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
      resolve();
    }, 150);
  });
}

export function addTileClassName(board, x, y) {
  board[x][y].div.classList.add("selected");
}

export function clearTileClassName(board, x, y) {
  board[x][y].div.classList.remove("selected");
}

export function getMovements(board, x, y) {
  let movements = [];
  board[x][y].obj.move(x, y, movements, board);
  return movements;
}

export function targetTile(board, x, y) {
  board[x][y].div.classList.add("red-available");
}

export function removeTargetTile(board, x, y) {
  board[x][y].div.classList.remove("red-available");
}

export function availbleMovesTiles(board, movements) {
  for (let i = 0; i < movements.length; i++) {
    let x = movements[i].x;
    let y = movements[i].y;
    if (movements[i].enemy) {
      board[x][y].div.classList.add("red-available");
      continue;
    }
    board[x][y].div.classList.add("available");
  }
}

export function clearAvailbleMovesTiles(board, movements) {
  for (let i = 0; i < movements.length; i++) {
    let x = movements[i].x;
    let y = movements[i].y;
    if (movements[i].enemy) {
      board[x][y].div.classList.remove("red-available");
      continue;
    }
    board[x][y].div.classList.remove("red-available");
    board[x][y].div.classList.remove("available");
  }
}

export function displayMessage(color) {
  const alert = document.querySelector(".alert");
  alert.style.display = "flex";
  const p_elem = alert.querySelector(".won-player");
  p_elem.textContent = color.toLocaleUpperCase() + " WINS";
  const scores = alert.querySelector(".score");
  scores.innerHTML = score[0] + "-" + score[1];
}

export async function animateCoin(board, i, j, lx, ly) {
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

export async function changePawn(board, color, x, y) {
  let waitForPressResolve;
  let check_alert = document.createElement("div");
  check_alert.classList.add("alert");
  check_alert.style.display = "flex";
  document.body.appendChild(check_alert);
  ["queen.png", "rook.png", "knight.png", "bishop.png"].forEach((el) => {
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
