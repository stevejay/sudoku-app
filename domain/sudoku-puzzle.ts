import every from "lodash/every";
import flatten from "lodash/flatten";
import range from "lodash/range";
import slice from "lodash/slice";
import some from "lodash/some";
import sortBy from "lodash/sortBy";
import sortedUniqBy from "lodash/sortedUniqBy";
import without from "lodash/without";
import uniqBy from "lodash/uniqBy";
import { STANDARD_SUDOKU_CONSTRAINTS } from "./sudoku-constraints";
import {
  parsePuzzleString,
  createPuzzleStringFromCellCollection,
} from "./sudoku-puzzle-string";
import {
  Cell,
  CellCollection,
  CellDigit,
  ConstraintCollection,
  ShadingColor,
  SudokuPuzzle,
} from "./sudoku-puzzle.types";

function createEmptyCell(index: number): Cell {
  return {
    index,
    isGivenDigit: false,
    digit: null,
    pencilDigits: [],
    shading: null,
  };
}

export function createPuzzle(
  initialConstraints: ConstraintCollection
): SudokuPuzzle {
  return {
    cells: range(0, 9 * 9).map(createEmptyCell),
    constraints: initialConstraints,
  };
}

export function createPuzzleFromPuzzleString(
  puzzleString: string
): SudokuPuzzle {
  const cells = parsePuzzleString(puzzleString).map((digit, index) =>
    digit === null
      ? createEmptyCell(index)
      : { ...createEmptyCell(index), isGivenDigit: true, digit }
  );
  return { cells, constraints: STANDARD_SUDOKU_CONSTRAINTS };
}

// Clears pencil marks, guesses, and shadings.
export function clearAllMarkingUp(puzzle: SudokuPuzzle): SudokuPuzzle {
  const newCells = puzzle.cells.map((cell) =>
    cell.isGivenDigit
      ? cell
      : { ...cell, digit: null, pencilDigits: [], shading: null }
  );
  return { ...puzzle, cells: newCells };
}

export function resetCell(
  puzzle: SudokuPuzzle,
  cellIndex: number
): SudokuPuzzle {
  const cell = puzzle.cells[cellIndex];
  const newCells = slice(puzzle.cells);
  newCells[cellIndex] = createEmptyCell(cell.index);
  return { ...puzzle, cells: newCells };
}

export function addGivenDigitToCell(
  puzzle: SudokuPuzzle,
  cellIndex: number,
  digit: CellDigit
): SudokuPuzzle {
  const cell = puzzle.cells[cellIndex];
  const newCells = slice(puzzle.cells);
  newCells[cellIndex] = { ...cell, isGivenDigit: true, digit };
  return { ...puzzle, cells: newCells };
}

export function addOrRemoveGuessDigit(
  puzzle: SudokuPuzzle,
  cellIndex: number,
  digit: CellDigit,
  isPencilDigit: boolean,
  highlightedDigit: CellDigit | null,
  clearPencilMarksInConstraintCells: boolean = true
): SudokuPuzzle {
  const cell = puzzle.cells[cellIndex];
  const newCells = slice(puzzle.cells);
  if (isPencilDigit) {
    if (cell.digit !== null) {
      // Ignore trying to set a pencil digit when there is already a digit.
      return puzzle;
    }
    newCells[cellIndex] = {
      ...cell,
      shading: digit === highlightedDigit ? 1 : cell.shading,
      pencilDigits: cell.pencilDigits.includes(digit)
        ? without(cell.pencilDigits, digit)
        : [...cell.pencilDigits, digit],
    };
  } else {
    const newDigit = cell.digit === digit ? null : digit;
    newCells[cellIndex] = {
      ...cell,
      digit: newDigit,
      shading:
        newDigit !== null && newDigit === highlightedDigit ? 1 : cell.shading,
      pencilDigits: [],
    };

    if (clearPencilMarksInConstraintCells) {
      const constrainedCells = getConstraintCellsForCell(puzzle, cellIndex);
      constrainedCells.forEach((cell) => {
        if (cell.pencilDigits.includes(digit)) {
          newCells[cell.index] = {
            ...cell,
            pencilDigits: without(cell.pencilDigits, digit),
          };
        }
      });
    }
  }
  return { ...puzzle, cells: newCells };
}

export function clearAllHighlights(puzzle: SudokuPuzzle): SudokuPuzzle {
  const newCells = puzzle.cells.map((cell) =>
    cell.shading === null ? cell : { ...cell, shading: null }
  );
  return { ...puzzle, cells: newCells };
}

export function highlightAllCellsWithErrors(
  puzzle: SudokuPuzzle
): SudokuPuzzle {
  const cellIndexesWithErrors = getInvalidCells(puzzle)
    .filter((cell) => !cell.isGivenDigit)
    .map((cell) => cell.index);
  const newCells = puzzle.cells.map((cell) =>
    cellIndexesWithErrors.includes(cell.index) || cell.digit === null
      ? { ...cell, shading: 0 as ShadingColor }
      : { ...cell, shading: null }
  );
  return { ...puzzle, cells: newCells };
}

export function highlightAllCellsForDigit(
  puzzle: SudokuPuzzle,
  digit: CellDigit
): SudokuPuzzle {
  const newCells = puzzle.cells.map((cell) =>
    cell.digit === digit || cell.pencilDigits.includes(digit)
      ? { ...cell, shading: 1 as ShadingColor }
      : { ...cell, shading: null }
  );
  return { ...puzzle, cells: newCells };
}

export function isValidPuzzle(puzzle: SudokuPuzzle): boolean {
  return (
    puzzle.cells.filter((cell) => cell.isGivenDigit).length >= 17 &&
    getInvalidCells(puzzle).length === 0
  );
}

export function puzzleCellIsGivenDigit(
  puzzle: SudokuPuzzle,
  cellIndex: number
): boolean {
  return puzzle.cells[cellIndex].isGivenDigit;
}

export function isSolved(puzzle: SudokuPuzzle): boolean {
  return (
    every(puzzle.cells, (cell) => cell.digit) &&
    getInvalidCells(puzzle).length === 0
  );
}

export function hasHighlighting(puzzle: SudokuPuzzle): boolean {
  return some(puzzle.cells, (cell) => cell.shading !== null);
}

export function createPuzzleUrl(
  puzzle: SudokuPuzzle,
  location: Location
): string {
  const puzzleString = createPuzzleStringFromCellCollection(puzzle.cells);
  return `https://${location.host}/?puzzle=${puzzleString}`;
}

export function getInvalidCells(puzzle: SudokuPuzzle): CellCollection {
  return uniqBy(
    flatten(
      puzzle.constraints.map((constraint) =>
        constraint.getInvalidCells(puzzle.cells)
      )
    ),
    (cell) => cell.index
  );
}

export function getConstraintCellsForCell(
  puzzle: SudokuPuzzle,
  cellIndex: number
): CellCollection {
  const cell = puzzle.cells[cellIndex];
  return sortedUniqBy(
    sortBy(
      flatten(
        puzzle.constraints.map((constraint) =>
          constraint.getConstraintCells(puzzle.cells, cell)
        )
      ),
      (cell) => cell.index
    ),
    (cell) => cell.index
  );
}
