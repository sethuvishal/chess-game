import { diagonalMove, straightMove } from "./pieceMove.js";

export default class Queen {
  constructor(color) {
    this.color = color;
    this.coin = "queen";
    this.img = color + this.coin + ".png";
  }

  move(x, y, movements, board) {
    diagonalMove(x, y, movements, board, this.color);
    straightMove(x, y, movements, board, this.color);
  }
}
