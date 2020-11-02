import filter from "lodash/filter";
import flatten from "lodash/flatten";
import groupBy from "lodash/groupBy";
import slice from "lodash/slice";
import range from "lodash/range";
import remove from "lodash/remove";
import type {
  Cell,
  CellCollection,
  ConstraintCollection,
  IConstraint,
} from "./sudoku-puzzle.types";

// Includes given digits.
function getInvalidCellsForCellGroup(cells: CellCollection): CellCollection {
  return flatten(
    filter(
      groupBy(
        cells.filter((cell) => !!cell.digit),
        (cell) => cell.digit
      ),
      (value) => value.length > 1
    )
  );
}

// export class UniqueInRowsConstraint

// export class UniqueInColumnsConstraint

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
    return removed.length ? boxCells : [];
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
    return removed.length ? columnCells : [];
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

  getInvalidCells(cells: CellCollection): CellCollection {
    const rowCells = this.getRowCells(cells);
    return getInvalidCellsForCellGroup(rowCells);
  }

  getConstraintCells(cells: CellCollection, cell: Cell): CellCollection {
    const rowCells = this.getRowCells(cells);
    const removed = remove(rowCells, (rowCell) => rowCell.index === cell.index);
    return removed.length ? rowCells : [];
  }

  private getRowCells(cells: CellCollection): CellCollection {
    return slice(cells, this.rowIndex * 9, this.rowIndex * 9 + 9);
  }
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
