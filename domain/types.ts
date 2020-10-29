export type CellValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type ShadingColor = 0 | 1 | 2 | 3 | 4;

export type Cell = Readonly<{
  index: number;
  digit: CellValue | null;
  isGivenDigit: boolean;
  pencilDigits: readonly CellValue[];
  shading: ShadingColor | null;
}>;

export type CellCollection = readonly Cell[];

export interface IConstraint {
  getInvalidCells(cells: CellCollection): CellCollection;
  getConstraintCells(cells: CellCollection, cell: Cell): CellCollection;
}

export type ConstraintCollection = readonly IConstraint[];
