import {
  createBlankCell,
  createGivenDigitCell,
  createGuessDigitCell,
  createTestSudokuPuzzle,
} from "testing/domain-testing-utils";
import {
  createInitialCellHighlighting,
  createCellHighlightingForErrors,
  isHighlightedCell,
  hasHighlighting,
  updateHighlightedDigit,
} from "./cell-highlighting";
import { CellHighlighting } from "./cell-highlighting.types";
import { Cell, CellDigit } from "./sudoku-puzzle.types";

describe("createInitialCellHighlighting", () => {
  it("should create a valid instance", () => {
    const result = createInitialCellHighlighting();
    expect(result.highlightedDigit).toBeNull();
    expect(result.highlightedCells).toEqual([]);
  });
});

describe("createCellHighlightingForErrors", () => {
  describe("when the puzzle has errors", () => {
    it("should create an instance with the correct error highlighting", () => {
      const puzzle = createTestSudokuPuzzle([
        createGivenDigitCell(0, 1), // [0,0]
        createGivenDigitCell(10, 2), // [1,1]
        createGivenDigitCell(30, 3), // [3,3]
        createGuessDigitCell(40, 3), // [4,4] same box as third
        createGuessDigitCell(8, 1), // [8,0] same row as first
        createGuessDigitCell(73, 2), // [1,8] Same column as second
      ]);
      const result = createCellHighlightingForErrors(puzzle);
      expect(result.highlightedDigit).toBeNull();
      expect(result.highlightedCells).toEqual([8, 40, 73]);
    });
  });

  describe("when the puzzle has no errors", () => {
    it("should create an instance with no highlighting", () => {
      const puzzle = createTestSudokuPuzzle();
      const result = createCellHighlightingForErrors(puzzle);
      expect(result.highlightedDigit).toBeNull();
      expect(result.highlightedCells).toEqual([]);
    });
  });
});

describe("isHighlightedCell", () => {
  describe("when the cell should not be highlighted", () => {
    it("should return false", () => {
      const cellHighlighting = createInitialCellHighlighting();
      const cell = createGivenDigitCell(10, 1);
      const result = isHighlightedCell(cellHighlighting, cell);
      expect(result).toEqual(false);
    });
  });

  describe("when the cell should be highlighted because of a digit match", () => {
    it("should return true", () => {
      const DIGIT: CellDigit = 1;
      const cellHighlighting: CellHighlighting = {
        highlightedDigit: DIGIT,
        highlightedCells: [],
      };
      const cell = createGuessDigitCell(10, DIGIT);
      const result = isHighlightedCell(cellHighlighting, cell);
      expect(result).toEqual(true);
    });
  });

  describe("when the cell should be highlighted because of a pencilDigits match", () => {
    it("should return true", () => {
      const DIGIT: CellDigit = 1;
      const cellHighlighting: CellHighlighting = {
        highlightedDigit: DIGIT,
        highlightedCells: [],
      };
      const cell: Cell = { ...createBlankCell(10), pencilDigits: [DIGIT] };
      const result = isHighlightedCell(cellHighlighting, cell);
      expect(result).toEqual(true);
    });
  });

  describe("when the cell should be highlighted because of a cell index match", () => {
    it("should return true", () => {
      const CELL_INDEX = 10;
      const cellHighlighting: CellHighlighting = {
        highlightedDigit: null,
        highlightedCells: [CELL_INDEX],
      };
      const cell = createBlankCell(CELL_INDEX);
      const result = isHighlightedCell(cellHighlighting, cell);
      expect(result).toEqual(true);
    });
  });
});

describe("hasHighlighting", () => {
  describe("when there is no cell highlighting", () => {
    it("should return false", () => {
      const cellHighlighting = createInitialCellHighlighting();
      const result = hasHighlighting(cellHighlighting);
      expect(result).toEqual(false);
    });
  });

  describe("when there is highlighting by cell index", () => {
    it("should return true", () => {
      const cellHighlighting: CellHighlighting = {
        highlightedDigit: null,
        highlightedCells: [1, 2, 3],
      };
      const result = hasHighlighting(cellHighlighting);
      expect(result).toEqual(true);
    });
  });

  describe("when there is highlighting by digit", () => {
    it("should return true", () => {
      const cellHighlighting: CellHighlighting = {
        highlightedDigit: 5,
        highlightedCells: [],
      };
      const result = hasHighlighting(cellHighlighting);
      expect(result).toEqual(true);
    });
  });
});

describe("updateHighlightedDigit", () => {
  it("should update the highlighted digit", () => {
    const cellHighlighting: CellHighlighting = {
      highlightedDigit: 1,
      highlightedCells: [1, 2, 3],
    };
    const NEW_DIGIT: CellDigit = 1;
    const result = updateHighlightedDigit(cellHighlighting, NEW_DIGIT);
    expect(result).toEqual<CellHighlighting>({
      highlightedDigit: NEW_DIGIT,
      highlightedCells: [],
    });
  });
});
