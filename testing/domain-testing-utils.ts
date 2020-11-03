import _ from "lodash";
import {
  Cell,
  CellCollection,
  CellDigit,
  ConstraintCollection,
  SudokuPuzzle,
} from "domain/sudoku-puzzle.types";
import { STANDARD_SUDOKU_CONSTRAINTS } from "domain/sudoku-constraints";

Object.freeze<ConstraintCollection>(STANDARD_SUDOKU_CONSTRAINTS);

export function createGivenDigitCell(index: number, digit: CellDigit): Cell {
  return Object.freeze<Cell>({
    index,
    isGivenDigit: true,
    digit,
    pencilDigits: [],
  });
}

export function createGuessDigitCell(index: number, digit: CellDigit): Cell {
  return Object.freeze<Cell>({
    index,
    isGivenDigit: false,
    digit,
    pencilDigits: [],
  });
}

export function createBlankCell(index: number): Cell {
  return Object.freeze<Cell>({
    index,
    isGivenDigit: false,
    digit: null,
    pencilDigits: [],
  });
}

export function createTestCellCollection(
  overrideCells?: CellCollection
): CellCollection {
  const cells = _.range(0, 9 * 9).map(createBlankCell);
  if (overrideCells) {
    overrideCells.forEach((cell) => {
      cells[cell.index] = cell;
    });
  }
  return Object.freeze<CellCollection>(cells);
}

export function createCompleteTestSudokuPuzzle() {
  return createTestSudokuPuzzle(
    _.range(0, 9 * 9).map((index) => createGuessDigitCell(index, 1))
  );
}

export function createTestSudokuPuzzle(
  overrideCells: CellCollection = null,
  constraints: ConstraintCollection = STANDARD_SUDOKU_CONSTRAINTS
): SudokuPuzzle {
  return Object.freeze<SudokuPuzzle>({
    cells: createTestCellCollection(overrideCells),
    constraints,
  });
}

export const VALID_PUZZLE_STRING =
  "9.4..7..2.7..16.....6......4.51..9.............8..32.6......7.....98..1.5..2..8.9";

// Two nines in the first row:
export const INVALID_PUZZLE_STRING =
  "9.9..7..2.7..16.....6......4.51..9.............8..32.6......7.....98..1.5..2..8.9";

export const VALID_FILLED_IN_PUZZLE_STRING =
  "215743896948126735376859421539482167427961358681375249163297584794538612852614973";

// Two twos in the first row:
export const INVALID_FILLED_IN_PUZZLE_STRING =
  "212743896948126735376859421539482167427961358681375249163297584794538612852614973";
