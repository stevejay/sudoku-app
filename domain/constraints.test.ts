import _ from "lodash";
import {
  BoxConstraint,
  ColumnConstraint,
  getInvalidCells,
  RowConstraint,
  STANDARD_SUDOKU_CONSTRAINTS,
} from "./constraints";
import { Cell, CellCollection, CellValue } from "./types";

function createGivenDigitCell(index: number, digit: CellValue): Cell {
  return { index, isGivenDigit: true, digit, pencilDigits: [], shading: null };
}

function createGuessDigitCell(index: number, digit: CellValue): Cell {
  return { index, isGivenDigit: false, digit, pencilDigits: [], shading: null };
}

function createBlankCell(index: number): Cell {
  return {
    index,
    isGivenDigit: false,
    digit: null,
    pencilDigits: [],
    shading: null,
  };
}

function createCellCollection(overrideCells?: CellCollection): CellCollection {
  const cells = _.range(0, 9 * 9).map(createBlankCell);
  if (overrideCells) {
    overrideCells.forEach((cell) => {
      cells[cell.index] = cell;
    });
  }
  return cells;
}

describe("BoxConstraint", () => {
  it("should be constructable", () => {
    new BoxConstraint(0);
  });

  describe("getInvalidCells", () => {
    // Box #4 indexes: 30, 31, 32, 39, 40, 41, 48, 49, 50.
    const constraint = new BoxConstraint(4);

    describe("when all cells are empty", () => {
      it("should return nothing", () => {
        const cells = createCellCollection();
        const result = constraint.getInvalidCells(cells);
        expect(result.length).toEqual(0);
      });
    });

    describe("when all cells are given", () => {
      it("should return nothing", () => {
        const cells = createCellCollection([
          createGivenDigitCell(30, 1),
          createGivenDigitCell(31, 2),
          createGivenDigitCell(32, 3),
          createGivenDigitCell(39, 4),
          createGivenDigitCell(40, 5),
          createGivenDigitCell(41, 6),
          createGivenDigitCell(48, 7),
          createGivenDigitCell(49, 8),
          createGivenDigitCell(50, 9),
        ]);
        const result = constraint.getInvalidCells(cells);
        expect(result.length).toEqual(0);
      });
    });

    describe("when all cells are guesses and there are no duplicates", () => {
      it("should return nothing", () => {
        const cells = createCellCollection([
          createGuessDigitCell(30, 1),
          createGuessDigitCell(31, 2),
          createGuessDigitCell(32, 3),
          createGuessDigitCell(39, 4),
          createGuessDigitCell(40, 5),
          createGuessDigitCell(41, 6),
          createGuessDigitCell(48, 7),
          createGuessDigitCell(49, 8),
          createGuessDigitCell(50, 9),
        ]);
        const result = constraint.getInvalidCells(cells);
        expect(result.length).toEqual(0);
      });
    });

    describe("when there are invalid cells in the constraint's box", () => {
      it("should return the invalid cells", () => {
        const invalidCells = [
          createGuessDigitCell(30, 1),
          createGuessDigitCell(31, 1),
        ];
        const cells = createCellCollection(invalidCells);
        const result = constraint.getInvalidCells(cells);
        expect(result).toEqual(invalidCells);
      });
    });

    describe("when there are invalid cells in the constraint's box and one cell is a given digit", () => {
      it("should only return the invalid cell that is not a given digit", () => {
        const invalidCells = [
          createGivenDigitCell(30, 1),
          createGuessDigitCell(31, 1),
        ];
        const cells = createCellCollection(invalidCells);
        const result = constraint.getInvalidCells(cells);
        expect(result).toEqual([invalidCells[1]]);
      });
    });

    describe("when there are invalid cells but not in the constraint's box", () => {
      it("should return nothing", () => {
        const cells = createCellCollection([
          createGuessDigitCell(0, 1),
          createGuessDigitCell(1, 1),
        ]);
        const result = constraint.getInvalidCells(cells);
        expect(result.length).toEqual(0);
      });
    });
  });
});

describe("RowConstraint", () => {
  it("should be constructable", () => {
    new RowConstraint(0);
  });

  describe("getInvalidCells", () => {
    // Row #4 indexes: 36, 37, 38, 39, 40, 41, 42, 43, 44
    const constraint = new RowConstraint(4);

    describe("when all cells are empty", () => {
      it("should return nothing", () => {
        const cells = createCellCollection();
        const result = constraint.getInvalidCells(cells);
        expect(result.length).toEqual(0);
      });
    });

    describe("when all cells are given", () => {
      it("should return nothing", () => {
        const cells = createCellCollection([
          createGivenDigitCell(36, 1),
          createGivenDigitCell(37, 2),
          createGivenDigitCell(38, 3),
          createGivenDigitCell(39, 4),
          createGivenDigitCell(40, 5),
          createGivenDigitCell(41, 6),
          createGivenDigitCell(42, 7),
          createGivenDigitCell(43, 8),
          createGivenDigitCell(44, 9),
        ]);
        const result = constraint.getInvalidCells(cells);
        expect(result.length).toEqual(0);
      });
    });

    describe("when all cells are guesses and there are no duplicates", () => {
      it("should return nothing", () => {
        const cells = createCellCollection([
          createGuessDigitCell(36, 1),
          createGuessDigitCell(37, 2),
          createGuessDigitCell(38, 3),
          createGuessDigitCell(39, 4),
          createGuessDigitCell(40, 5),
          createGuessDigitCell(41, 6),
          createGuessDigitCell(42, 7),
          createGuessDigitCell(43, 8),
          createGuessDigitCell(44, 9),
        ]);
        const result = constraint.getInvalidCells(cells);
        expect(result.length).toEqual(0);
      });
    });

    describe("when there are invalid cells in the constraint's box", () => {
      it("should return the invalid cells", () => {
        const invalidCells = [
          createGuessDigitCell(36, 1),
          createGuessDigitCell(37, 1),
        ];
        const cells = createCellCollection(invalidCells);
        const result = constraint.getInvalidCells(cells);
        expect(result).toEqual(invalidCells);
      });
    });

    describe("when there are invalid cells in the constraint's box and one cell is a given digit", () => {
      it("should only return the invalid cell that is not a given digit", () => {
        const invalidCells = [
          createGivenDigitCell(36, 1),
          createGuessDigitCell(37, 1),
        ];
        const cells = createCellCollection(invalidCells);
        const result = constraint.getInvalidCells(cells);
        expect(result).toEqual([invalidCells[1]]);
      });
    });

    describe("when there are invalid cells but not in the constraint's box", () => {
      it("should return nothing", () => {
        const cells = createCellCollection([
          createGuessDigitCell(0, 1),
          createGuessDigitCell(1, 1),
        ]);
        const result = constraint.getInvalidCells(cells);
        expect(result.length).toEqual(0);
      });
    });
  });
});

describe("ColumnConstraint", () => {
  it("should be constructable", () => {
    new ColumnConstraint(0);
  });

  describe("getInvalidCells", () => {
    // Column #4 indexes: 4, 13, 22, 31, 40, 49, 58, 67, 76
    const constraint = new ColumnConstraint(4);

    describe("when all cells are empty", () => {
      it("should return nothing", () => {
        const cells = createCellCollection();
        const result = constraint.getInvalidCells(cells);
        expect(result.length).toEqual(0);
      });
    });

    describe("when all cells are given", () => {
      it("should return nothing", () => {
        const cells = createCellCollection([
          createGivenDigitCell(4, 1),
          createGivenDigitCell(13, 2),
          createGivenDigitCell(22, 3),
          createGivenDigitCell(31, 4),
          createGivenDigitCell(40, 5),
          createGivenDigitCell(49, 6),
          createGivenDigitCell(58, 7),
          createGivenDigitCell(67, 8),
          createGivenDigitCell(76, 9),
        ]);
        const result = constraint.getInvalidCells(cells);
        expect(result.length).toEqual(0);
      });
    });

    describe("when all cells are guesses and there are no duplicates", () => {
      it("should return nothing", () => {
        const cells = createCellCollection([
          createGuessDigitCell(4, 1),
          createGuessDigitCell(13, 2),
          createGuessDigitCell(22, 3),
          createGuessDigitCell(31, 4),
          createGuessDigitCell(40, 5),
          createGuessDigitCell(49, 6),
          createGuessDigitCell(58, 7),
          createGuessDigitCell(67, 8),
          createGuessDigitCell(76, 9),
        ]);
        const result = constraint.getInvalidCells(cells);
        expect(result.length).toEqual(0);
      });
    });

    describe("when there are invalid cells in the constraint's box", () => {
      it("should return the invalid cells", () => {
        const invalidCells = [
          createGuessDigitCell(4, 1),
          createGuessDigitCell(13, 1),
        ];
        const cells = createCellCollection(invalidCells);
        const result = constraint.getInvalidCells(cells);
        expect(result).toEqual(invalidCells);
      });
    });

    describe("when there are invalid cells in the constraint's box and one cell is a given digit", () => {
      it("should only return the invalid cell that is not a given digit", () => {
        const invalidCells = [
          createGivenDigitCell(4, 1),
          createGuessDigitCell(13, 1),
        ];
        const cells = createCellCollection(invalidCells);
        const result = constraint.getInvalidCells(cells);
        expect(result).toEqual([invalidCells[1]]);
      });
    });

    describe("when there are invalid cells but not in the constraint's box", () => {
      it("should return nothing", () => {
        const cells = createCellCollection([
          createGuessDigitCell(0, 1),
          createGuessDigitCell(1, 1),
        ]);
        const result = constraint.getInvalidCells(cells);
        expect(result.length).toEqual(0);
      });
    });
  });
});

describe("getInvalidCells", () => {
  describe("when all cells are empty", () => {
    it("should return nothing", () => {
      const cells = createCellCollection();
      const result = getInvalidCells(STANDARD_SUDOKU_CONSTRAINTS, cells);
      expect(result.length).toEqual(0);
    });
  });

  describe("when the puzzle is partially filled and there are no invalid cells", () => {
    it("should return nothing", () => {
      const cells = createCellCollection([
        createGivenDigitCell(0, 1), // [0,0]
        createGivenDigitCell(10, 2), // [1,1]
        createGivenDigitCell(30, 3), // [3,3]
        createGuessDigitCell(40, 4), // [4,4] same box as third
        createGuessDigitCell(8, 5), // [8,0] same row as first
        createGuessDigitCell(73, 6), // [1,8] Same column as second
      ]);
      const result = getInvalidCells(STANDARD_SUDOKU_CONSTRAINTS, cells);
      expect(result.length).toEqual(0);
    });
  });

  describe("when the puzzle is partially filled and there are invalid cells", () => {
    it("should return the invalid cells", () => {
      const cells = createCellCollection([
        createGivenDigitCell(0, 1), // [0,0]
        createGivenDigitCell(10, 2), // [1,1]
        createGivenDigitCell(30, 3), // [3,3]
        createGuessDigitCell(40, 3), // [4,4] same box as third
        createGuessDigitCell(8, 1), // [8,0] same row as first
        createGuessDigitCell(73, 2), // [1,8] Same column as second
      ]);
      const result = getInvalidCells(STANDARD_SUDOKU_CONSTRAINTS, cells);
      expect(result).toEqual([cells[8], cells[73], cells[40]]);
    });
  });

  describe("when the puzzle is partially filled and there are cells that are invalid via multiple constraints", () => {
    it("should return the deduplicated invalid cells", () => {
      const cells = createCellCollection([
        createGivenDigitCell(0, 1), // [0,0]
        createGivenDigitCell(10, 2), // [1,1]
        createGivenDigitCell(30, 3), // [3,3]
        createGuessDigitCell(1, 1), // [0,1] same box and row as first
        createGuessDigitCell(2, 1), // [0,2] same box and row as first
      ]);
      const result = getInvalidCells(STANDARD_SUDOKU_CONSTRAINTS, cells);
      expect(result).toEqual([cells[1], cells[2]]);
    });
  });
});
