import type { CellHighlighting } from "./cell-highlighting.types";
import { getAllCellsWithErrors } from "./sudoku-puzzle";
import type { Cell, CellDigit, SudokuPuzzle } from "./sudoku-puzzle.types";

export function createInitialCellHighlighting(): CellHighlighting {
  return {
    highlightedDigit: null,
    highlightedCells: [],
  };
}

export function createCellHighlightingForErrors(
  puzzle: SudokuPuzzle
): CellHighlighting {
  const cellIndexes = getAllCellsWithErrors(puzzle).map((cell) => cell.index);
  cellIndexes.sort((a, b) => a - b);
  return {
    highlightedDigit: null,
    highlightedCells: cellIndexes,
  };
}

// TODO test or remove
export function updateHighlightedDigit(
  _: CellHighlighting,
  digit: CellDigit | null
): CellHighlighting {
  return {
    highlightedDigit: digit,
    highlightedCells: [],
  };
}

// TODO test or remove
export function toggleHighlightedDigit(
  cellHighlighting: CellHighlighting,
  digit: CellDigit
): CellHighlighting {
  return {
    highlightedDigit:
      digit !== null && cellHighlighting.highlightedDigit === digit
        ? null
        : digit,
    highlightedCells: [],
  };
}

export function isHighlightedCell(
  cellHighlighting: CellHighlighting,
  cell: Cell
): boolean {
  const { highlightedDigit, highlightedCells } = cellHighlighting;
  if (highlightedCells.length) {
    return highlightedCells.includes(cell.index);
  }
  if (highlightedDigit === null) {
    return false;
  }
  return (
    cell.digit === highlightedDigit ||
    cell.pencilDigits.includes(highlightedDigit)
  );
}

export function hasHighlighting(cellHighlighting: CellHighlighting): boolean {
  return (
    !!cellHighlighting.highlightedCells.length ||
    cellHighlighting.highlightedDigit !== null
  );
}
