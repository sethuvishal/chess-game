import Pawn from "./pawn.js";
import King from "./king.js";
import Knight from "./knight.js";
import Queen from "./queen.js";
import Bishop from "./bishop.js";
import Rook from "./rook.js";

function findCoin(coin, color, img) {
  if (coin === "") return null;
  else if (coin === "pawn") return new Pawn(color, img);
  else if (coin === "queen") return new Queen(color, img);
  else if (coin === "king") return new King(color, img);
  else if (coin === "rook") return new Rook(color, img);
  else if (coin === "knight") return new Knight(color, img);
  else if (coin === "bishop") return new Bishop(color, img);
}

export default class tile {
  constructor(x, y, img, color, coin, className) {
    this.div = document.createElement("div");
    this.className = className;
    this.div.setAttribute("class", className);
    this.div.classList.add("class", "tile");
    this.x = x;
    this.y = y;
    this.obj = findCoin(coin, color, img);
  }

  update(coin, color, img) {
    this.obj = findCoin(coin, color, img);
  }
}
