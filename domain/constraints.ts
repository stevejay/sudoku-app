import { chain } from "lodash";
import slice from "lodash/slice";
import range from "lodash/range";
import remove from "lodash/remove";
import {
  Cell,
  CellCollection,
  ConstraintCollection,
  IConstraint,
} from "./types";

export class BoxConstraint implements IConstraint {
  readonly boxIndex: number;

  constructor(boxIndex: number) {
    this.boxIndex = boxIndex;
  }

  getInvalidCells(cells: CellCollection): CellCollection {
    const boxCells = this.getBoxCells(cells);
    return getInvalidCellsForCellGroup(boxCells);
  }

  getConstraintCells(cells: CellCollection, cell: Cell): CellCollection {
    const boxCells = this.getBoxCells(cells);
    const removed = remove(boxCells, (boxCell) => boxCell.index === cell.index);
    return removed.length ? boxCells : null;
  }

  private getBoxCells(cells: CellCollection): CellCollection {
    const rowIndex = (this.boxIndex % 3) * 3;
    const columnIndex = Math.floor(this.boxIndex / 3) * 27;
    const topLeftIndex = columnIndex + rowIndex;
    return [
      cells[topLeftIndex],
      cells[topLeftIndex + 1],
      cells[topLeftIndex + 2],
      cells[topLeftIndex + 9],
      cells[topLeftIndex + 9 + 1],
      cells[topLeftIndex + 9 + 2],
      cells[topLeftIndex + 18],
      cells[topLeftIndex + 18 + 1],
      cells[topLeftIndex + 18 + 2],
    ];
  }
}

export class ColumnConstraint implements IConstraint {
  readonly columnIndex: number;

  constructor(columnIndex: number) {
    this.columnIndex = columnIndex;
  }

  getInvalidCells(cells: CellCollection): CellCollection {
    const columnCells = this.getColumnCells(cells);
    return getInvalidCellsForCellGroup(columnCells);
  }

  getConstraintCells(cells: CellCollection, cell: Cell): CellCollection {
    const columnCells = this.getColumnCells(cells);
    const removed = remove(
      columnCells,
      (columnCell) => columnCell.index === cell.index
    );
    return removed.length ? columnCells : null;
  }

  private getColumnCells(cells: CellCollection): CellCollection {
    return range(this.columnIndex, 9 * 9, 9).map((index) => cells[index]);
  }
}

export class RowConstraint implements IConstraint {
  readonly rowIndex: number;

  constructor(rowIndex: number) {
    this.rowIndex = rowIndex;
  }

  //   affectsCell(cell: Cell): boolean {
  //     return Math.floor(cell.index / 9) === this.rowIndex;
  //   }

  getInvalidCells(cells: CellCollection): CellCollection {
    const rowCells = this.getRowCells(cells);
    return getInvalidCellsForCellGroup(rowCells);
  }

  getConstraintCells(cells: CellCollection, cell: Cell): CellCollection {
    const rowCells = this.getRowCells(cells);
    const removed = remove(rowCells, (rowCell) => rowCell.index === cell.index);
    return removed.length ? rowCells : null;
  }

  private getRowCells(cells: CellCollection): CellCollection {
    return slice(cells, this.rowIndex * 9, this.rowIndex * 9 + 9);
  }
}

function getInvalidCellsForCellGroup(cells: CellCollection): CellCollection {
  return (
    chain(cells)
      // Remove cells not filled in:
      .filter((cell) => !!cell.digit)
      // Group by digit:
      .groupBy((cell) => cell.digit)
      // Keep groups with more than one cell for a digit:
      .filter((value) => value.length > 1)
      // Turn back into an array:
      .flatten()
      .value()
  );
}

export function getInvalidCells(
  constraints: ConstraintCollection,
  cells: CellCollection
): CellCollection {
  return chain(constraints)
    .map((constraint) => constraint.getInvalidCells(cells))
    .flatten()
    .uniqBy((cell) => cell.index)
    .value();
}

export const STANDARD_SUDOKU_CONSTRAINTS: ConstraintCollection = [
  new RowConstraint(0),
  new RowConstraint(1),
  new RowConstraint(2),
  new RowConstraint(3),
  new RowConstraint(4),
  new RowConstraint(5),
  new RowConstraint(6),
  new RowConstraint(7),
  new RowConstraint(8),
  new ColumnConstraint(0),
  new ColumnConstraint(1),
  new ColumnConstraint(2),
  new ColumnConstraint(3),
  new ColumnConstraint(4),
  new ColumnConstraint(5),
  new ColumnConstraint(6),
  new ColumnConstraint(7),
  new ColumnConstraint(8),
  new BoxConstraint(0),
  new BoxConstraint(1),
  new BoxConstraint(2),
  new BoxConstraint(3),
  new BoxConstraint(4),
  new BoxConstraint(5),
  new BoxConstraint(6),
  new BoxConstraint(7),
  new BoxConstraint(8),
];
