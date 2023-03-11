import { straightMove } from "./pieceMove.js";

export default class Rook {
  constructor(color) {
    this.color = color;
    this.coin = "rook";
    this.img = color + this.coin + ".png";
    this.moved = false;
  }

  move(x, y, movements, board) {
    straightMove(x, y, movements, board, this.color);
  }
  changed() {
    this.moved = true;
  }
}
