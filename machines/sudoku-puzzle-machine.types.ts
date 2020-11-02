import type { EventData } from "xstate";
import type { CellDigit, SudokuPuzzle } from "domain/sudoku-puzzle.types";
import type { PuzzleString } from "domain/sudoku-puzzle-string.types";
import type { CellHighlighting } from "domain/cell-highlighting.types";

export enum PuzzleError {
  INVALID_PUZZLE = "INVALID_PUZZLE",
  PUZZLE_NOT_SOLVED = "PUZZLE_NOT_SOLVED",
}

export type PuzzleContext = {
  puzzle: SudokuPuzzle;
  undoStack: readonly SudokuPuzzle[];
  redoStack: readonly SudokuPuzzle[];
  checkpointPuzzle: SudokuPuzzle | null;
  cellHighlighting: CellHighlighting;
  errorState: { error: PuzzleError | null } | null;
};

export type PuzzleTypestate =
  | { value: "initialising"; context: PuzzleContext }
  | { value: "creatingPuzzle"; context: PuzzleContext }
  | { value: "solvingPuzzle"; context: PuzzleContext }
  | { value: "solvedPuzzle"; context: PuzzleContext };

export type RequestClearCellEvent = {
  type: "REQUEST_CLEAR_CELL";
  payload: { index: number };
};
export type DigitEnteredEvent = {
  type: "DIGIT_ENTERED";
  payload: {
    index: number;
    digit: CellDigit;
    isPencilDigit: boolean;
  };
};
export type RequestStartEnteringPuzzleEvent = {
  type: "REQUEST_START_ENTERING_PUZZLE";
};
export type RequestResetPuzzleEvent = { type: "REQUEST_RESET_PUZZLE" };
export type RequestStartSolvingPuzzleEvent = {
  type: "REQUEST_START_SOLVING_PUZZLE";
};
export type RequestCheckPuzzleEvent = { type: "REQUEST_CHECK_PUZZLE" };
export type RequestUndoEvent = { type: "REQUEST_UNDO" };
export type RequestRedoEvent = { type: "REQUEST_REDO" };
export type RequestSaveCheckpointEvent = { type: "REQUEST_SAVE_CHECKPOINT" };
export type RequestRestoreCheckpointEvent = {
  type: "REQUEST_RESTORE_CHECKPOINT";
};
export type RequestSetPuzzleFromPuzzleStringEvent = {
  type: "REQUEST_SET_PUZZLE_FROM_PUZZLE_STRING";
  payload: { puzzleString: PuzzleString };
};
export type RequestClearAllHighlightsEvent = {
  type: "REQUEST_CLEAR_ALL_HIGHLIGHTS";
};
export type RequestUpdateHighlightedDigitEvent = {
  type: "REQUEST_UPDATE_HIGHLIGHTED_DIGIT";
  payload: { digit: CellDigit };
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
  | RequestUpdateHighlightedDigitEvent;

export type PuzzleSend = (event: PuzzleEvent, payload?: EventData) => unknown;
