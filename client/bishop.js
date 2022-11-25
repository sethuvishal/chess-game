import { diagonalMove } from "./pieceMove.js";

export default class Bishop {
  constructor(color, img) {
    this.color = color;
    this.coin = "bishop";
    this.img = img;
  }

  move(x, y, movements, board) {
    diagonalMove(x, y, movements, board, this.color);
  }
}
