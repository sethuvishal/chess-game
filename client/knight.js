import { knightMove } from "./pieceMove.js";

export default class Knight {
  constructor(color, img) {
    this.color = color;
    this.coin = "knight";
    this.img = img;
  }

  move(x, y, movements, board) {
    knightMove(x, y, movements, board, this.color);
  }
}
