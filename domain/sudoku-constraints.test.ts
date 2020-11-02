import _ from "lodash";
import {
  createTestCellCollection,
  createGivenDigitCell,
  createGuessDigitCell,
} from "testing/domain-testing-utils";
import {
  BoxConstraint,
  ColumnConstraint,
  RowConstraint,
} from "./sudoku-constraints";
import { CellCollection } from "./sudoku-puzzle.types";

describe("BoxConstraint", () => {
  it("should be constructable", () => {
    new BoxConstraint(0);
  });

  describe("getInvalidCells", () => {
    // Box #4 indexes: 30, 31, 32, 39, 40, 41, 48, 49, 50.
    const constraint = new BoxConstraint(4);

    describe("when all cells are empty", () => {
      it("should return nothing", () => {
        const cells = createTestCellCollection();
        const result = constraint.getInvalidCells(cells);
        expect(result.length).toEqual(0);
      });
    });

    describe("when all cells are given", () => {
      it("should return nothing", () => {
        const cells = createTestCellCollection([
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
        const cells = createTestCellCollection([
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
        const cells = createTestCellCollection(invalidCells);
        const result = constraint.getInvalidCells(cells);
        expect(result).toEqual<CellCollection>(invalidCells);
      });
    });

    describe("when there are invalid cells in the constraint's box and one cell is a given digit", () => {
      it("should return all invalid cells including the given digit", () => {
        const invalidCells = [
          createGivenDigitCell(30, 1),
          createGuessDigitCell(31, 1),
        ];
        const cells = createTestCellCollection(invalidCells);
        const result = constraint.getInvalidCells(cells);
        expect(result).toEqual<CellCollection>(invalidCells);
      });
    });

    describe("when there are invalid cells but not in the constraint's box", () => {
      it("should return nothing", () => {
        const cells = createTestCellCollection([
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
        const cells = createTestCellCollection();
        const result = constraint.getInvalidCells(cells);
        expect(result.length).toEqual(0);
      });
    });

    describe("when all cells are given", () => {
      it("should return nothing", () => {
        const cells = createTestCellCollection([
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
        const cells = createTestCellCollection([
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
        const cells = createTestCellCollection(invalidCells);
        const result = constraint.getInvalidCells(cells);
        expect(result).toEqual<CellCollection>(invalidCells);
      });
    });

    describe("when there are invalid cells in the constraint's box and one cell is a given digit", () => {
      it("should return all invalid cells including the given digit", () => {
        const invalidCells = [
          createGivenDigitCell(36, 1),
          createGuessDigitCell(37, 1),
        ];
        const cells = createTestCellCollection(invalidCells);
        const result = constraint.getInvalidCells(cells);
        expect(result).toEqual<CellCollection>(invalidCells);
      });
    });

    describe("when there are invalid cells but not in the constraint's box", () => {
      it("should return nothing", () => {
        const cells = createTestCellCollection([
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
        const cells = createTestCellCollection();
        const result = constraint.getInvalidCells(cells);
        expect(result.length).toEqual(0);
      });
    });

    describe("when all cells are given", () => {
      it("should return nothing", () => {
        const cells = createTestCellCollection([
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
        const cells = createTestCellCollection([
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
        const cells = createTestCellCollection(invalidCells);
        const result = constraint.getInvalidCells(cells);
        expect(result).toEqual<CellCollection>(invalidCells);
      });
    });

    describe("when there are invalid cells in the constraint's box and one cell is a given digit", () => {
      it("should return all invalid cells including the given digit", () => {
        const invalidCells = [
          createGivenDigitCell(4, 1),
          createGuessDigitCell(13, 1),
        ];
        const cells = createTestCellCollection(invalidCells);
        const result = constraint.getInvalidCells(cells);
        expect(result).toEqual<CellCollection>(invalidCells);
      });
    });

    describe("when there are invalid cells but not in the constraint's box", () => {
      it("should return nothing", () => {
        const cells = createTestCellCollection([
          createGuessDigitCell(0, 1),
          createGuessDigitCell(1, 1),
        ]);
        const result = constraint.getInvalidCells(cells);
        expect(result.length).toEqual(0);
      });
    });
  });
});
