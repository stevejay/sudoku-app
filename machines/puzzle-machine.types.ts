import { EventData } from "xstate";
import { Cell, CellCollection, CellValue } from "domain/types";

export enum PuzzleError {
  INVALID_PUZZLE = "INVALID_PUZZLE",
  PUZZLE_NOT_SOLVED = "PUZZLE_NOT_SOLVED",
}

export type PuzzleContext = {
  cells: CellCollection;
  undoStack: readonly CellCollection[];
  redoStack: readonly CellCollection[];
  checkpointCells: CellCollection | null;
  errorState: { error: PuzzleError | null } | null;
};

export type PuzzleTypestate =
  | { value: "initialising"; context: PuzzleContext }
  | { value: "enteringPuzzle"; context: PuzzleContext }
  | { value: "solvingPuzzle"; context: PuzzleContext }
  | { value: "solvedPuzzle"; context: PuzzleContext };

export type RequestClearCellEvent = {
  type: "REQUEST_CLEAR_CELL";
  payload: { index: Cell["index"] };
};
export type DigitEnteredEvent = {
  type: "DIGIT_ENTERED";
  payload: {
    index: Cell["index"];
    digit: CellValue;
    ctrlKey: boolean;
  };
};
export type RequestStartEnteringPuzzleEvent = {
  type: "REQUEST_START_ENTERING_PUZZLE";
};
export type RequestResetPuzzleEvent = { type: "REQUEST_RESET_PUZZLE" };
export type RequestStartSolvingPuzzleEvent = { type: "REQUEST_START_SOLVING_PUZZLE" };
export type RequestCheckPuzzleEvent = { type: "REQUEST_CHECK_PUZZLE" };
export type RequestUndoEvent = { type: "REQUEST_UNDO" };
export type RequestRedoEvent = { type: "REQUEST_REDO" };
export type RequestSaveCheckpointEvent = { type: "REQUEST_SAVE_CHECKPOINT" };
export type RequestRestoreCheckpointEvent = {
  type: "REQUEST_RESTORE_CHECKPOINT";
};
export type RequestSetPuzzleFromPuzzleStringEvent = {
  type: "REQUEST_SET_PUZZLE_FROM_PUZZLE_STRING";
  payload: { puzzleString: string };
};
export type RequestClearAllHighlightsEvent = {
  type: "REQUEST_CLEAR_ALL_HIGHLIGHTS";
};
export type RequestHighlightAllCellsWithDigitEvent = {
  type: "REQUEST_HIGHLIGHT_ALL_CELLS_WITH_DIGIT";
  payload: { digit: CellValue };
};

export type PuzzleEvent =
  | DigitEnteredEvent
  | RequestStartEnteringPuzzleEvent
  | RequestSetPuzzleFromPuzzleStringEvent
  | RequestResetPuzzleEvent
  | RequestClearCellEvent
  | RequestStartSolvingPuzzleEvent
  | RequestCheckPuzzleEvent
  | RequestUndoEvent
  | RequestRedoEvent
  | RequestSaveCheckpointEvent
  | RequestRestoreCheckpointEvent
  | RequestClearAllHighlightsEvent
  | RequestHighlightAllCellsWithDigitEvent;

export type PuzzleSend = (event: PuzzleEvent, payload?: EventData) => unknown;
