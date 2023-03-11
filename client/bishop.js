import { diagonalMove } from "./pieceMove.js";

export default class Bishop {
  constructor(color) {
    this.color = color;
    this.coin = "bishop";
    this.img = color + this.coin + ".png";
  }

  move(x, y, movements, board) {
    diagonalMove(x, y, movements, board, this.color);
  }
}
