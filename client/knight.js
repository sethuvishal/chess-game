import { knightMove } from "./pieceMove.js";

export default class Knight {
  constructor(color) {
    this.color = color;
    this.coin = "knight";
    this.img = color + this.coin + ".png";
  }

  move(x, y, movements, board) {
    knightMove(x, y, movements, board, this.color);
  }
}
