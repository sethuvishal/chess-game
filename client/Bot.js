// import { whiteKingState, blackKingState } from "./kingState.js";
import pawn from "./pawn.js";
import queen from "./queen.js";
import rook from "./pawn.js";
import bishop from "./bishop.js";
import knight from "./pawn.js";

function deepCopyOfBoard(board) {
  let clone = new Array();
  for (var i = 0; i < board.length; i++) {
    clone.push([]);
    for (var j = 0; j < board[i].length; j++) {
      let p1 = { ...board[i][j] };
      clone[i].push(p1);
    }
  }
  return clone;
}

function makeMove(board, moves) {
  if (moves.castling) {
    const { rx, ry } = moves.rookObj;
    const { x, y } = moves.to;
    const pieceKing = board[moves.i][moves.j].obj;
    const pieceRook = board[rx][ry].obj;
    board[x][y].obj = pieceRook;
    board[rx][ry].obj = null;
    board[moves.x][moves.y].obj = pieceKing;
    board[moves.i][moves.j].obj = null;
    return board;
  }
  if (moves.changeTo !== undefined) {
    const { x, y, i, j } = moves;
    const piece = board[i][j].obj;
    let obj = null;
    if (moves.changeTo == "queen") obj = new queen(piece.color);
    else if (moves.changeTo == "rook") obj = new rook(piece.color);
    else if (moves.changeTo == "bishop") obj = new bishop(piece.color);
    else if (moves.changeTo == "knight") obj = new knight(piece.color);
    board[x][y].obj = obj;
    board[i][j].obj = null;
    return board;
  }
  const { x, y, i, j } = moves;
  const piece = board[i][j].obj;
  board[x][y].obj = piece;
  board[i][j].obj = null;
  return board;
}
function unMakeMove(board, moves) {
  if (moves.castling) {
    const { rx, ry } = moves.rookObj;
    const { x, y } = moves.to;
    const pieceKing = board[moves.x][moves.y].obj;
    const pieceRook = board[x][y].obj;
    board[rx][ry].obj = pieceRook;
    board[x][y].obj = null;
    board[moves.i][moves.j].obj = pieceKing;
    board[moves.x][moves.y].obj = null;
    return board;
  }
  if (moves.changeTo) {
    const { x, y, i, j } = moves;
    const piece = board[x][y].obj;
    board[i][j].obj = new pawn(piece.color);
    board[x][y].obj = null;
    return board;
  }
  const { x, y, i, j } = moves;
  const piece = board[x][y].obj;
  board[i][j].obj = piece;
  board[x][y].obj = null;
  return board;
}

export default class BotBuilder {
  constructor(color) {
    this.board;
    this.color = color;
    this.count = 0;
    this.maxDepth = 3;
    this.scores = {
      pawn: 100,
      bishop: 300,
      knight: 450,
      rook: 600,
      queen: 1000,
      king: 10000,
    };
  }

  getAllPossibleMoves(board, color) {
    let moves = [];

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = board[i][j]?.obj;
        let size = moves.length;
        if (piece && piece.color === color) {
          piece.move(i, j, moves, board);
          for (let k = size; k < moves.length; k++) {
            moves[k] = { ...moves[k], i, j };
          }
        }
      }
    }

    return moves;
  }

  evaluate(board) {
    let score = 0;

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = board[i][j].obj;
        if (piece) {
          score +=
            piece.color === this.color
              ? this.scores[piece.coin]
              : -this.scores[piece.coin];
        }
      }
    }
    return score;
  }
  moveOrdering(board, possibleMoves) {
    return possibleMoves;
  }

  move(board1) {
    this.board = deepCopyOfBoard(board1);
    let bestMove = null;
    let bestValue = -Infinity;
    let minDepth = Infinity;
    let possibleMoves = this.getAllPossibleMoves(this.board, this.color);

    possibleMoves = possibleMoves.sort(() => Math.random() - 0.5);
    for (const moves of possibleMoves) {
      let obj = this.board[moves.x][moves.y].obj;
      let newBoard = makeMove(this.board, moves);

      const { mindepth, value } = this.alphaBetaPruning(
        newBoard,
        this.maxDepth,
        -Infinity,
        Infinity,
        false,
        moves.castling
      );
      // if (value >= bestValue) console.log(value, moves);
      newBoard = unMakeMove(this.board, moves);
      this.board[moves.x][moves.y].obj = obj;
      if (value >= bestValue && minDepth > mindepth) {
        bestValue = value;
        bestMove = moves;
        minDepth = mindepth;
      } else if (value > bestValue) {
        bestValue = value;
        bestMove = moves;
        minDepth = mindepth;
      }
    }
    return bestMove;
  }
  alphaBetaPruning(board, depth, alpha, beta, isMaximizing, c) {
    if (depth === 0) {
      let val = this.evaluate(board);
      return { mindepth: this.maxDepth, value: val };
    }
    this.count++;
    if (isMaximizing) {
      let bestValue = -Infinity;
      let curMinDepth = Infinity;
      let possibleMoves = this.getAllPossibleMoves(board, this.color);
      for (const move of possibleMoves) {
        let obj = board[move.x][move.y].obj;
        makeMove(board, move);

        let { value, mindepth } = this.alphaBetaPruning(
          board,
          depth - 1,
          alpha,
          beta,
          false,
          c
        );
        unMakeMove(board, move);
        board[move.x][move.y].obj = obj;
        // bestValue = Math.max(bestValue, val);
        if (value >= bestValue && mindepth < curMinDepth) {
          bestValue = value;
          curMinDepth = mindepth;
        } else if (value > bestValue) {
          bestValue = value;
          curMinDepth = mindepth;
        }
        alpha = Math.max(alpha, bestValue);
        if (beta <= alpha) {
          break;
        }
      }
      // curMinDepth =
      //   curMinDepth === Infinity ? this.maxDepth - depth : curMinDepth;
      curMinDepth = Math.min(curMinDepth, this.maxDepth - depth);
      return { value: bestValue, mindepth: curMinDepth };
    } else {
      let bestValue = Infinity;
      let curMinDepth = Infinity;
      let possibleMoves = this.getAllPossibleMoves(
        board,
        this.color === "white" ? "black" : "white"
      );
      for (const move of possibleMoves) {
        let obj = board[move.x][move.y].obj;
        makeMove(board, move);
        let { value, mindepth } = this.alphaBetaPruning(
          board,
          depth - 1,
          alpha,
          beta,
          true,
          c
        );
        // bestValue = Math.min(bestValue, val);
        if (value <= bestValue && mindepth < curMinDepth) {
          bestValue = value;
          curMinDepth = mindepth;
        } else if (value < bestValue) {
          bestValue = value;
          curMinDepth = mindepth;
        }
        unMakeMove(board, move);
        board[move.x][move.y].obj = obj;
        beta = Math.min(beta, bestValue);
        if (beta <= alpha) {
          break;
        }
      }
      // curMinDepth =
      //   curMinDepth === Infinity ? this.maxDepth - depth : curMinDepth;
      curMinDepth = Math.min(curMinDepth, this.maxDepth - depth);
      return { value: bestValue, mindepth: curMinDepth };
    }
  }
}
