export type CellDigit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type Cell = Readonly<{
  index: number;
  digit: CellDigit | null;
  isGivenDigit: boolean;
  pencilDigits: readonly CellDigit[]; // Unique but not sorted.
}>;

export type CellCollection = readonly Cell[];

export interface IConstraint {
  // Note: getInvalidCells returns given digit cells as well.
  getInvalidCells(cells: CellCollection): CellCollection;
  getConstraintCells(cells: CellCollection, cell: Cell): CellCollection;
}

export type ConstraintCollection = readonly IConstraint[];

export type SudokuPuzzle = Readonly<{
  cells: CellCollection;
  constraints: ConstraintCollection;
}>;
