import type { CellDigit } from "./sudoku-puzzle.types";

// highlightedCells takes precedence over highlightedDigit.
export type CellHighlighting = Readonly<{
  highlightedDigit: CellDigit | null;
  highlightedCells: number[];
}>;
