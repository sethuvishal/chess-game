import { diagonalMove, straightMove } from "./pieceMove.js";

export default class Queen {
  constructor(color, img) {
    this.color = color;
    this.coin = "queen";
    this.img = img;
  }

  move(x, y, movements, board) {
    diagonalMove(x, y, movements, board, this.color);
    straightMove(x, y, movements, board, this.color);
  }
}
