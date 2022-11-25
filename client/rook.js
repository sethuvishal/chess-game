import { straightMove } from "./pieceMove.js";

export default class Rook {
  constructor(color, img) {
    this.color = color;
    this.coin = "rook";
    this.img = img;
    this.moved = false;
  }

  move(x, y, movements, board) {
    straightMove(x, y, movements, board, this.color);
  }
  changed() {
    this.moved = true;
  }
}
