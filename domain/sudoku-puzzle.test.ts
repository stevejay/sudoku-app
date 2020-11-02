import _ from "lodash";
import {
  createBlankCell,
  createCompleteTestSudokuPuzzle,
  createGivenDigitCell,
  createGuessDigitCell,
  createTestSudokuPuzzle,
  INVALID_FILLED_IN_PUZZLE_STRING,
  INVALID_PUZZLE_STRING,
  VALID_FILLED_IN_PUZZLE_STRING,
  VALID_PUZZLE_STRING,
} from "testing/domain-testing-utils";
import { STANDARD_SUDOKU_CONSTRAINTS } from "./sudoku-constraints";
import {
  addOrRemoveGuessDigit,
  puzzleCellIsGivenDigit,
  clearAllMarkingUp,
  createPuzzle,
  createPuzzleFromPuzzleString,
  getInvalidCells,
  isValidPuzzle,
  resetCell,
  isSolved,
  createPuzzleUrl,
  getConstraintCellsForCell,
  puzzleHasMarkingUp,
  puzzleIsNotAlreadyReset,
  cellIsNotAlreadyReset,
  addOrRemoveGivenDigit,
  isComplete,
} from "./sudoku-puzzle";
import type { Cell, CellCollection, SudokuPuzzle } from "./sudoku-puzzle.types";

describe("createPuzzle", () => {
  it("should create a valid puzzle", () => {
    const result = createPuzzle(STANDARD_SUDOKU_CONSTRAINTS);
    expect(result.constraints).toBe(STANDARD_SUDOKU_CONSTRAINTS);
    expect(result.cells.length).toEqual(81);
    result.cells.forEach((cell, index) => {
      expect(cell.index).toEqual(index);
      expect(cell.digit).toBeNull();
      expect(cell.isGivenDigit).toEqual(false);
      expect(cell.pencilDigits).toHaveLength(0);
    });
  });
});

describe("createPuzzleFromPuzzleString", () => {
  const BASIC_PUZZLE_STRING =
    "123456789" +
    _.range(9, 81)
      .map(() => ".")
      .join("");

  it("should create a valid puzzle", () => {
    const result = createPuzzleFromPuzzleString(BASIC_PUZZLE_STRING);
    expect(result.constraints).toBe(STANDARD_SUDOKU_CONSTRAINTS);
    expect(result.cells.length).toEqual(81);
    result.cells.forEach((cell, index) => {
      expect(cell.index).toEqual(index);
      expect(cell.pencilDigits).toHaveLength(0);
    });
    expect(result.cells[0]).toMatchObject<Partial<Cell>>({
      digit: 1,
      isGivenDigit: true,
    });
    expect(result.cells[1]).toMatchObject<Partial<Cell>>({
      digit: 2,
      isGivenDigit: true,
    });
    expect(result.cells[2]).toMatchObject<Partial<Cell>>({
      digit: 3,
      isGivenDigit: true,
    });
    expect(result.cells[3]).toMatchObject<Partial<Cell>>({
      digit: 4,
      isGivenDigit: true,
    });
    expect(result.cells[4]).toMatchObject<Partial<Cell>>({
      digit: 5,
      isGivenDigit: true,
    });
    expect(result.cells[5]).toMatchObject<Partial<Cell>>({
      digit: 6,
      isGivenDigit: true,
    });
    expect(result.cells[6]).toMatchObject<Partial<Cell>>({
      digit: 7,
      isGivenDigit: true,
    });
    expect(result.cells[7]).toMatchObject<Partial<Cell>>({
      digit: 8,
      isGivenDigit: true,
    });
    expect(result.cells[8]).toMatchObject<Partial<Cell>>({
      digit: 9,
      isGivenDigit: true,
    });
    expect(result.cells[9]).toMatchObject<Partial<Cell>>({
      digit: null,
      isGivenDigit: false,
    });
  });
});

describe("puzzleHasMarkingUp", () => {
  describe("when there is no marking up", () => {
    it("should return false", () => {
      const puzzle = createTestSudokuPuzzle();
      const result = puzzleHasMarkingUp(puzzle);
      expect(result).toEqual(false);
    });
  });

  describe("when there is a given digit", () => {
    it("should return false", () => {
      const puzzle = createTestSudokuPuzzle([
        { ...createBlankCell(10), digit: 1, isGivenDigit: true },
      ]);
      const result = puzzleHasMarkingUp(puzzle);
      expect(result).toEqual(false);
    });
  });

  describe("when there is a guess digit", () => {
    it("should return true", () => {
      const puzzle = createTestSudokuPuzzle([
        { ...createBlankCell(10), digit: 2 },
      ]);
      const result = puzzleHasMarkingUp(puzzle);
      expect(result).toEqual(true);
    });
  });

  describe("when there are pencil digits", () => {
    it("should return true", () => {
      const puzzle = createTestSudokuPuzzle([
        { ...createBlankCell(10), pencilDigits: [1, 2, 3] },
      ]);
      const result = puzzleHasMarkingUp(puzzle);
      expect(result).toEqual(true);
    });
  });
});

describe("clearAllMarkingUp", () => {
  it("should clear all marking up", () => {
    const puzzle = createTestSudokuPuzzle([
      { ...createBlankCell(0), digit: 1, isGivenDigit: true },
      { ...createBlankCell(1), digit: 2 },
      { ...createBlankCell(2), pencilDigits: [1, 2, 3] },
    ]);
    const result = clearAllMarkingUp(puzzle);
    expect(result.constraints).toBe(puzzle.constraints);
    expect(result.cells).toEqual<CellCollection>([
      puzzle.cells[0],
      createBlankCell(1),
      createBlankCell(2),
      ...puzzle.cells.slice(3),
    ]);
  });
});

describe("resetCell", () => {
  const CELL_INDEX = 10;

  const EXPECTED_CELL = Object.freeze<Cell>({
    index: CELL_INDEX,
    isGivenDigit: false,
    digit: null,
    pencilDigits: [],
  });

  it("should reset a given digit cell", () => {
    const puzzle = createTestSudokuPuzzle([
      { ...createBlankCell(CELL_INDEX), digit: 1, isGivenDigit: true },
    ]);
    const result = resetCell(puzzle, CELL_INDEX);
    expect(result.constraints).toBe(puzzle.constraints);
    expect(result.cells.length).toEqual(81);
    expect(result.cells[CELL_INDEX]).toEqual<Cell>(EXPECTED_CELL);
  });

  it("should reset a guess digit cell", () => {
    const puzzle = createTestSudokuPuzzle([
      { ...createBlankCell(CELL_INDEX), digit: 2 },
    ]);
    const result = resetCell(puzzle, CELL_INDEX);
    expect(result.constraints).toBe(puzzle.constraints);
    expect(result.cells.length).toEqual(81);
    expect(result.cells[CELL_INDEX]).toEqual<Cell>(EXPECTED_CELL);
  });

  it("should reset a pencil digits cell", () => {
    const puzzle = createTestSudokuPuzzle([
      { ...createBlankCell(CELL_INDEX), pencilDigits: [1, 2, 3] },
    ]);
    const result = resetCell(puzzle, CELL_INDEX);
    expect(result.constraints).toBe(puzzle.constraints);
    expect(result.cells.length).toEqual(81);
    expect(result.cells[CELL_INDEX]).toEqual<Cell>(EXPECTED_CELL);
  });
});

describe("puzzleIsNotAlreadyReset", () => {
  describe("when the puzzle is already reset", () => {
    it("should return false", () => {
      const puzzle = createTestSudokuPuzzle();
      const result = puzzleIsNotAlreadyReset(puzzle);
      expect(result).toEqual(false);
    });
  });

  describe("when a cell has a given digit", () => {
    it("should return true", () => {
      const puzzle = createTestSudokuPuzzle([
        { ...createBlankCell(10), digit: 1, isGivenDigit: true },
      ]);
      const result = puzzleIsNotAlreadyReset(puzzle);
      expect(result).toEqual(true);
    });
  });

  describe("when a cell has a guess digit", () => {
    it("should return true", () => {
      const puzzle = createTestSudokuPuzzle([
        { ...createBlankCell(10), digit: 2 },
      ]);
      const result = puzzleIsNotAlreadyReset(puzzle);
      expect(result).toEqual(true);
    });
  });

  describe("when a cell has pencil digits", () => {
    it("should return true", () => {
      const puzzle = createTestSudokuPuzzle([
        { ...createBlankCell(10), pencilDigits: [1, 2, 3] },
      ]);
      const result = puzzleIsNotAlreadyReset(puzzle);
      expect(result).toEqual(true);
    });
  });
});

describe("cellIsNotAlreadyReset", () => {
  const CELL_INDEX = 10;

  describe("when the cell is already reset", () => {
    it("should return false", () => {
      const puzzle = createTestSudokuPuzzle();
      const result = cellIsNotAlreadyReset(puzzle, CELL_INDEX);
      expect(result).toEqual(false);
    });
  });

  describe("when a cell has a given digit", () => {
    it("should return true", () => {
      const puzzle = createTestSudokuPuzzle([
        { ...createBlankCell(CELL_INDEX), digit: 1, isGivenDigit: true },
      ]);
      const result = cellIsNotAlreadyReset(puzzle, CELL_INDEX);
      expect(result).toEqual(true);
    });
  });

  describe("when a cell has a guess digit", () => {
    it("should return true", () => {
      const puzzle = createTestSudokuPuzzle([
        { ...createBlankCell(CELL_INDEX), digit: 2 },
      ]);
      const result = cellIsNotAlreadyReset(puzzle, CELL_INDEX);
      expect(result).toEqual(true);
    });
  });

  describe("when a cell has pencil digits", () => {
    it("should return true", () => {
      const puzzle = createTestSudokuPuzzle([
        { ...createBlankCell(CELL_INDEX), pencilDigits: [1, 2, 3] },
      ]);
      const result = cellIsNotAlreadyReset(puzzle, CELL_INDEX);
      expect(result).toEqual(true);
    });
  });
});

describe("addOrRemoveGivenDigit", () => {
  const CELL_INDEX = 10;

  describe("when the cell is not already for the given digit", () => {
    it("should set the cell to the given digit", () => {
      const puzzle = createTestSudokuPuzzle();
      const result = addOrRemoveGivenDigit(puzzle, CELL_INDEX, 5);
      expect(result.constraints).toBe(puzzle.constraints);
      expect(result.cells.length).toEqual(81);
      expect(result.cells[CELL_INDEX]).toEqual<Cell>({
        index: CELL_INDEX,
        isGivenDigit: true,
        digit: 5,
        pencilDigits: [],
      });
    });
  });

  describe("when the cell is for a different given digit", () => {
    it("should set the cell to the given digit", () => {
      const puzzle = createTestSudokuPuzzle([
        { ...createBlankCell(CELL_INDEX), digit: 1, isGivenDigit: true },
      ]);
      const result = addOrRemoveGivenDigit(puzzle, CELL_INDEX, 5);
      expect(result.constraints).toBe(puzzle.constraints);
      expect(result.cells.length).toEqual(81);
      expect(result.cells[CELL_INDEX]).toEqual<Cell>({
        index: CELL_INDEX,
        isGivenDigit: true,
        digit: 5,
        pencilDigits: [],
      });
    });
  });

  describe("when the cell is already for the given digit", () => {
    it("should remove the given digit from the cell", () => {
      const puzzle = createTestSudokuPuzzle([
        { ...createBlankCell(CELL_INDEX), digit: 5, isGivenDigit: true },
      ]);
      const result = addOrRemoveGivenDigit(puzzle, CELL_INDEX, 5);
      expect(result.constraints).toBe(puzzle.constraints);
      expect(result.cells.length).toEqual(81);
      expect(result.cells[CELL_INDEX]).toEqual<Cell>({
        index: CELL_INDEX,
        isGivenDigit: false,
        digit: null,
        pencilDigits: [],
      });
    });
  });
});

describe("addOrRemoveGuessDigit", () => {
  const CELL_INDEX = 10;

  describe("when the guess digit is a pencil digit", () => {
    describe("when the pencil digit has already been added", () => {
      it("should remove the guess digit from the pencil digits", () => {
        const puzzle = createTestSudokuPuzzle([
          { ...createBlankCell(CELL_INDEX), pencilDigits: [3, 2, 1] },
        ]);
        const result = addOrRemoveGuessDigit(puzzle, CELL_INDEX, 2, true);
        expect(result.constraints).toBe(puzzle.constraints);
        expect(result.cells.length).toEqual(81);
        expect(result.cells[CELL_INDEX]).toEqual<Cell>({
          index: CELL_INDEX,
          isGivenDigit: false,
          digit: null,
          pencilDigits: [3, 1],
        });
      });
    });

    describe("when the pencil digit has not already been added", () => {
      it("should add the guess digit to the pencil digits", () => {
        const puzzle = createTestSudokuPuzzle([
          { ...createBlankCell(CELL_INDEX), pencilDigits: [1, 3] },
        ]);
        const result = addOrRemoveGuessDigit(puzzle, CELL_INDEX, 2, true);
        expect(result.constraints).toBe(puzzle.constraints);
        expect(result.cells.length).toEqual(81);
        expect(result.cells[CELL_INDEX]).toEqual<Cell>({
          index: CELL_INDEX,
          isGivenDigit: false,
          digit: null,
          pencilDigits: [1, 3, 2],
        });
      });
    });

    describe("when the cell has a guess digit", () => {
      it("should ignore the request", () => {
        const puzzle = createTestSudokuPuzzle([
          { ...createBlankCell(CELL_INDEX), digit: 3 },
        ]);
        const result = addOrRemoveGuessDigit(puzzle, CELL_INDEX, 2, true);
        expect(result).toEqual<SudokuPuzzle>(puzzle);
      });
    });
  });

  describe("when the guess digit is not a pencil digit", () => {
    describe("when the given digit is already set", () => {
      it("should clear the digit", () => {
        const puzzle = createTestSudokuPuzzle([
          { ...createBlankCell(CELL_INDEX), digit: 2 },
        ]);
        const result = addOrRemoveGuessDigit(puzzle, CELL_INDEX, 2, false);
        expect(result.constraints).toBe(puzzle.constraints);
        expect(result.cells.length).toEqual(81);
        expect(result.cells[CELL_INDEX]).toEqual<Cell>({
          index: CELL_INDEX,
          isGivenDigit: false,
          digit: null,
          pencilDigits: [],
        });
      });
    });

    describe("when the given digit is not already set", () => {
      it("should set the digit", () => {
        const puzzle = createTestSudokuPuzzle([createBlankCell(CELL_INDEX)]);
        const result = addOrRemoveGuessDigit(puzzle, CELL_INDEX, 2, false);
        expect(result.constraints).toBe(puzzle.constraints);
        expect(result.cells.length).toEqual(81);
        expect(result.cells[CELL_INDEX]).toEqual<Cell>({
          index: CELL_INDEX,
          isGivenDigit: false,
          digit: 2,
          pencilDigits: [],
        });
      });
    });
  });
});

describe("isValidPuzzle", () => {
  describe("when the puzzle is empty", () => {
    it("should return false", () => {
      const puzzle = createTestSudokuPuzzle();
      const result = isValidPuzzle(puzzle);
      expect(result).toEqual(false);
    });
  });

  describe("when the puzzle has constraint violations", () => {
    it("should return false", () => {
      const puzzle = createPuzzleFromPuzzleString(INVALID_PUZZLE_STRING);
      const result = isValidPuzzle(puzzle);
      expect(result).toEqual(false);
    });
  });

  describe("when the puzzle is valid", () => {
    it("should return true", () => {
      const puzzle = createPuzzleFromPuzzleString(VALID_PUZZLE_STRING);
      const result = isValidPuzzle(puzzle);
      expect(result).toEqual(true);
    });
  });
});

describe("puzzleCellIsGivenDigit", () => {
  const CELL_INDEX = 10;

  describe("when cell is a given digit cell", () => {
    it("should return true", () => {
      const puzzle = createTestSudokuPuzzle([
        createGivenDigitCell(CELL_INDEX, 3),
      ]);
      const result = puzzleCellIsGivenDigit(puzzle, CELL_INDEX);
      expect(result).toEqual(true);
    });
  });

  describe("when cell is not a given digit cell", () => {
    it("should return true", () => {
      const puzzle = createTestSudokuPuzzle([
        createGuessDigitCell(CELL_INDEX, 3),
      ]);
      const result = puzzleCellIsGivenDigit(puzzle, CELL_INDEX);
      expect(result).toEqual(false);
    });
  });
});

describe("isSolved", () => {
  describe("when the puzzle is empty", () => {
    it("should return false", () => {
      const puzzle = createTestSudokuPuzzle();
      const result = isSolved(puzzle);
      expect(result).toEqual(false);
    });
  });

  describe("when the puzzle is filled in but there are errors", () => {
    it("should return false", () => {
      const puzzle = createPuzzleFromPuzzleString(
        INVALID_FILLED_IN_PUZZLE_STRING
      );
      const result = isSolved(puzzle);
      expect(result).toEqual(false);
    });
  });

  describe("when the puzzle is filled in correctly", () => {
    it("should return true", () => {
      const puzzle = createPuzzleFromPuzzleString(
        VALID_FILLED_IN_PUZZLE_STRING
      );
      const result = isSolved(puzzle);
      expect(result).toEqual(true);
    });
  });
});

describe("createPuzzleUrl", () => {
  it("should create the puzzle url", () => {
    const mockLocation = { host: "localhost:3000" } as Location;
    const puzzle = createPuzzleFromPuzzleString(VALID_PUZZLE_STRING);
    const result = createPuzzleUrl(puzzle, mockLocation);
    expect(result).toEqual(
      `https://localhost:3000/?puzzle=${VALID_PUZZLE_STRING}`
    );
  });
});

describe("getConstraintCellsForCell", () => {
  it("should return the correct cells", () => {
    const puzzle = createTestSudokuPuzzle();
    const result = getConstraintCellsForCell(puzzle, 1); // [0,1]
    expect(result.map((cell) => cell.index)).toEqual([
      0,
      // 1, Cell queried is excluded from result.
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      18,
      19,
      20,
      28,
      37,
      46,
      55,
      64,
      73,
    ]);
  });
});

describe("getInvalidCells", () => {
  describe("when all cells are empty", () => {
    it("should return nothing", () => {
      const puzzle = createTestSudokuPuzzle();
      const result = getInvalidCells(puzzle);
      expect(result.length).toEqual(0);
    });
  });

  describe("when the puzzle is partially filled and there are no invalid cells", () => {
    it("should return nothing", () => {
      const puzzle = createTestSudokuPuzzle([
        createGivenDigitCell(0, 1), // [0,0]
        createGivenDigitCell(10, 2), // [1,1]
        createGivenDigitCell(30, 3), // [3,3]
        createGuessDigitCell(40, 4), // [4,4] same box as third
        createGuessDigitCell(8, 5), // [8,0] same row as first
        createGuessDigitCell(73, 6), // [1,8] Same column as second
      ]);
      const result = getInvalidCells(puzzle);
      expect(result.length).toEqual(0);
    });
  });

  describe("when the puzzle is partially filled and there are invalid cells", () => {
    it("should return the invalid cells but not the unfilled cells", () => {
      const puzzle = createTestSudokuPuzzle([
        createGivenDigitCell(0, 1), // [0,0]
        createGivenDigitCell(10, 2), // [1,1]
        createGivenDigitCell(30, 3), // [3,3]
        createGuessDigitCell(40, 3), // [4,4] same box as third
        createGuessDigitCell(8, 1), // [0,8] same row as first
        createGuessDigitCell(73, 2), // [8,1] Same column as second
        createGuessDigitCell(7, 2), // [0,7] Does not conflict
      ]);
      const result = getInvalidCells(puzzle);
      expect(result.length).toEqual(6);
      expect(result).toContain(puzzle.cells[0]);
      expect(result).toContain(puzzle.cells[10]);
      expect(result).toContain(puzzle.cells[30]);
      expect(result).toContain(puzzle.cells[40]);
      expect(result).toContain(puzzle.cells[8]);
      expect(result).toContain(puzzle.cells[73]);
    });
  });

  describe("when the puzzle is partially filled and there are cells that are invalid via multiple constraints", () => {
    it("should return the invalid cells including given digits", () => {
      const puzzle = createTestSudokuPuzzle([
        createGivenDigitCell(0, 1), // [0,0]
        createGivenDigitCell(10, 2), // [1,1]
        createGivenDigitCell(30, 3), // [3,3]
        createGuessDigitCell(1, 1), // [0,1] same box and row as first
        createGuessDigitCell(2, 1), // [0,2] same box and row as first
      ]);
      const result = getInvalidCells(puzzle);
      expect(result.length).toEqual(3);
      expect(result).toContain(puzzle.cells[0]);
      expect(result).toContain(puzzle.cells[1]);
      expect(result).toContain(puzzle.cells[2]);
    });
  });
});

describe("isComplete", () => {
  describe("when the puzzle is complete", () => {
    it("should return true", () => {
      const puzzle = createCompleteTestSudokuPuzzle();
      const result = isComplete(puzzle);
      expect(result).toEqual(true);
    });
  });

  describe("when the puzzle is not complete", () => {
    it("should return false", () => {
      const puzzle = createTestSudokuPuzzle();
      const result = isComplete(puzzle);
      expect(result).toEqual(false);
    });
  });
});
