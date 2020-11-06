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
  SudokuPuzzle,
} from "./sudoku-puzzle.types";

function createEmptyCell(index: number): Cell {
  return {
    index,
    isGivenDigit: false,
    digit: null,
    pencilDigits: [],
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

export function puzzleHasMarkingUp(puzzle: SudokuPuzzle): boolean {
  return !every(
    puzzle.cells,
    (cell) =>
      cell.isGivenDigit ||
      (cell.digit === null && cell.pencilDigits.length === 0)
  );
}

// Clears pencil marks and guesses but not given digits.
export function clearAllMarkingUp(puzzle: SudokuPuzzle): SudokuPuzzle {
  const newCells = puzzle.cells.map(
    (cell): Cell =>
      cell.isGivenDigit ? cell : { ...cell, digit: null, pencilDigits: [] }
  );
  return { ...puzzle, cells: newCells };
}

export function puzzleIsNotAlreadyReset(puzzle: SudokuPuzzle): boolean {
  return some(puzzle.cells, (cell) =>
    cellIsNotAlreadyReset(puzzle, cell.index)
  );
}

export function cellIsNotAlreadyReset(
  puzzle: SudokuPuzzle,
  cellIndex: number
): boolean {
  const cell = puzzle.cells[cellIndex];
  return cell.digit !== null || cell.isGivenDigit || !!cell.pencilDigits.length;
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

export function addOrRemoveGivenDigit(
  puzzle: SudokuPuzzle,
  cellIndex: number,
  digit: CellDigit
): SudokuPuzzle {
  const cell = puzzle.cells[cellIndex];
  const newCells = slice(puzzle.cells);
  if (cell.digit === digit && cell.isGivenDigit) {
    newCells[cellIndex] = {
      ...cell,
      isGivenDigit: false,
      digit: null,
      pencilDigits: [],
    };
  } else {
    newCells[cellIndex] = {
      ...cell,
      isGivenDigit: true,
      digit,
      pencilDigits: [],
    };
  }
  return { ...puzzle, cells: newCells };
}

export function addOrRemoveGuessDigit(
  puzzle: SudokuPuzzle,
  cellIndex: number,
  digit: CellDigit,
  isPencilDigit: boolean,
  clearPencilMarksInConstraintCells: boolean = true
): SudokuPuzzle {
  const cell = puzzle.cells[cellIndex];
  if (cell.isGivenDigit) {
    throw new Error("addOrRemoveGuessDigit invoked on given digit");
  }
  const newCells = slice(puzzle.cells);
  if (isPencilDigit) {
    if (cell.digit !== null) {
      // Ignore trying to set a pencil digit when there is already a digit.
      return puzzle;
    }
    newCells[cellIndex] = {
      ...cell,
      pencilDigits: cell.pencilDigits.includes(digit)
        ? without(cell.pencilDigits, digit)
        : [...cell.pencilDigits, digit],
    };
  } else {
    const newDigit = cell.digit === digit ? null : digit;
    newCells[cellIndex] = {
      ...cell,
      digit: newDigit,
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

export function getAllCellsWithErrors(puzzle: SudokuPuzzle): CellCollection {
  return getInvalidCells(puzzle).filter((cell) => !cell.isGivenDigit);
}

export function getAllCellsForDigit(
  puzzle: SudokuPuzzle,
  digit: CellDigit
): CellCollection {
  return puzzle.cells.filter(
    (cell) => cell.digit === digit || cell.pencilDigits.includes(digit)
  );
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

export function isComplete(puzzle: SudokuPuzzle): boolean {
  return every(puzzle.cells, (cell) => cell.digit);
}

export function isSolved(puzzle: SudokuPuzzle): boolean {
  return isComplete(puzzle) && getInvalidCells(puzzle).length === 0;
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
