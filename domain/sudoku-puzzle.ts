import { Cell, CellCollection, ConstraintCollection } from "./types";

export type SudokuPuzzle = {
  cells: CellCollection;
  constraints: ConstraintCollection;
};

export function createInitialPuzzleState(
  initialConstraints: ConstraintCollection
): SudokuPuzzle {
  throw new Error("not implemented");
}

export function clearAllMarkingUp(puzzle: SudokuPuzzle): SudokuPuzzle {
  throw new Error("not implemented");
}

export function resetPuzzleCell(
  puzzle: SudokuPuzzle,
  cellIndex: Cell["index"]
): SudokuPuzzle {
  throw new Error("not implemented");
}
