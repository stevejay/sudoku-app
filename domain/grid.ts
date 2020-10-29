import range from "lodash/range";
import slice from "lodash/slice";
import without from "lodash/without";
import some from "lodash/some";
import every from "lodash/every";
import { getInvalidCells } from "./constraints";
import { Cell, CellCollection, CellValue, ConstraintCollection } from "./types";

// TODO rename this file: CellCollection; PuzzleGrid

export function createInitialCellCollection(): CellCollection {
  return range(0, 9 * 9).map(createEmptyCell);
}

export function createEmptyCell(index: number): Cell {
  return {
    index,
    isGivenDigit: false,
    digit: null,
    pencilDigits: [],
    shading: null,
  };
}

export function resetCell(
  cells: CellCollection,
  index: Cell["index"]
): CellCollection {
  const cell = cells[index];
  const newCells = slice(cells);
  newCells[index] = createEmptyCell(cell.index);
  return newCells;
}

export function addGivenDigitToCell(
  cells: CellCollection,
  index: Cell["index"],
  digit: CellValue
): CellCollection {
  const cell = cells[index];
  const newCells = slice(cells);
  newCells[index] = { ...cell, isGivenDigit: true, digit };
  return newCells;
}

export function addGuessDigitToCell(
  cells: CellCollection,
  index: Cell["index"],
  digit: CellValue,
  isPencilDigit: boolean
): CellCollection {
  const cell = cells[index];
  const newCells = slice(cells);
  if (isPencilDigit) {
    newCells[index] = {
      ...cell,
      pencilDigits: cell.pencilDigits.includes(digit)
        ? without(cell.pencilDigits, digit)
        : [...cell.pencilDigits, digit],
    };
  } else {
    // TODO get all constraint cells for this cell
    // and clear all pencil digits that have the same digit?

    newCells[index] = {
      ...cell,
      digit,
      pencilDigits: [],
      //   shading: null,
    };
  }
  return newCells;
}

export function clearAllMarkingUp(cells: CellCollection): CellCollection {
  return cells.map((cell) =>
    cell.isGivenDigit
      ? cell
      : { ...cell, digit: null, pencilDigits: [], shading: null }
  );
}

export function clearAllHighlights(cells: CellCollection): CellCollection {
  return cells.map((cell) =>
    cell.shading === null ? cell : { ...cell, shading: null }
  );
}

export function highlightAllCellsWithErrors(
  cells: CellCollection,
  constraints: ConstraintCollection
): CellCollection {
  const cellIndexesWithErrors = getInvalidCells(constraints, cells)
    .filter((cell) => !cell.isGivenDigit)
    .map((cell) => cell.index);
  return cells.map((cell) =>
    cellIndexesWithErrors.includes(cell.index) || cell.digit === null
      ? { ...cell, shading: 0 }
      : { ...cell, shading: null }
  );
}

export function highlightAllCellsForDigit(
  cells: CellCollection,
  digit: CellValue
): CellCollection {
  return cells.map((cell) =>
    cell.digit === digit || cell.pencilDigits.includes(digit)
      ? { ...cell, shading: 1 }
      : { ...cell, shading: null }
  );
}

export function isValidPuzzle(
  cells: CellCollection,
  constraints: ConstraintCollection
): boolean {
  return (
    cells.filter((cell) => cell.isGivenDigit).length >= 17 &&
    getInvalidCells(constraints, cells).length === 0
  );
}

export function isSolved(
  cells: CellCollection,
  constraints: ConstraintCollection
): boolean {
  return (
    every(cells, (cell) => cell.digit) &&
    getInvalidCells(constraints, cells).length === 0
  );
}

export function hasHighlighting(cells: CellCollection): boolean {
  return some(cells, (cell) => cell.shading !== null);
}
