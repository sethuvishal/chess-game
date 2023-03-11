import Pawn from "./pawn.js";
import King from "./king.js";
import Knight from "./knight.js";
import Queen from "./queen.js";
import Bishop from "./bishop.js";
import Rook from "./rook.js";

function findCoin(coin, color) {
  if (coin === "") return null;
  else if (coin === "pawn") return new Pawn(color);
  else if (coin === "queen") return new Queen(color);
  else if (coin === "king") return new King(color);
  else if (coin === "rook") return new Rook(color);
  else if (coin === "knight") return new Knight(color);
  else if (coin === "bishop") return new Bishop(color);
}

export default class tile {
  constructor(x, y, className) {
    this.div = document.createElement("div");
    this.className = className;
    this.div.classList.add(className);
    this.div.classList.add("tile");
    this.x = x;
    this.y = y;
    this.obj = null;
  }
  update(coin, color, img) {
    this.obj = findCoin(coin, color);
  }
}
