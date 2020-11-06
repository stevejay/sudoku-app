import memoize from "lodash/memoize";
import slice from "lodash/slice";
import { assign, createMachine } from "xstate";
import { STANDARD_SUDOKU_CONSTRAINTS } from "domain/sudoku-constraints";
import { isValidPuzzleString } from "domain/sudoku-puzzle-string";
import * as puzzle from "domain/sudoku-puzzle";
import * as highlighting from "domain/cell-highlighting";
import {
  PuzzleError,
  PuzzleContext,
  PuzzleEvent,
  PuzzleTypestate,
  DigitEnteredEvent,
  RequestClearCellEvent,
  RequestSetPuzzleFromPuzzleStringEvent,
  RequestUpdateHighlightedDigitEvent,
} from "./sudoku-puzzle-machine.types";
import { SudokuPuzzle } from "domain/sudoku-puzzle.types";
import { CellHighlighting } from "domain/cell-highlighting.types";

export function getCanUndo(ctx: PuzzleContext): boolean {
  return !!ctx.undoStack.length;
}

export function getCanRedo(ctx: PuzzleContext): boolean {
  return !!ctx.redoStack.length;
}

export function getHasCheckpoint(ctx: PuzzleContext): boolean {
  return !!ctx.checkpointPuzzle;
}

export function getPuzzle(ctx: PuzzleContext): SudokuPuzzle {
  return ctx.puzzle;
}

export function getHighlighting(ctx: PuzzleContext): CellHighlighting {
  return ctx.cellHighlighting;
}

export function getErrorState(ctx: PuzzleContext): PuzzleContext["errorState"] {
  return ctx.errorState;
}

export const getPuzzleIsComplete = memoize(
  (ctx: PuzzleContext): boolean => puzzle.isComplete(ctx.puzzle),
  (ctx: PuzzleContext) => ctx.puzzle
);

export const getCanResetWhileCreating = memoize(
  (ctx: PuzzleContext): boolean => puzzle.puzzleIsNotAlreadyReset(ctx.puzzle),
  (ctx: PuzzleContext) => ctx.puzzle
);

export function getIsValidPuzzle(ctx: PuzzleContext): boolean {
  return puzzle.isValidPuzzle(ctx.puzzle);
}

function pushCurrentPuzzleStateToUndoStack(ctx: PuzzleContext) {
  const MAX_UNDO_STACK_LENGTH = 100;
  const newUndoStack = slice(
    ctx.undoStack,
    ctx.undoStack.length >= MAX_UNDO_STACK_LENGTH
      ? ctx.undoStack.length - (MAX_UNDO_STACK_LENGTH - 1)
      : 0
  );
  newUndoStack.push(ctx.puzzle);
  return newUndoStack;
}

export function createSudokuPuzzleMachine() {
  return createMachine<PuzzleContext, PuzzleEvent, PuzzleTypestate>(
    {
      initial: "creatingPuzzle",
      states: {
        creatingPuzzle: {
          on: {
            REQUEST_CLEAR_CELL: {
              cond: "cellIsNotAlreadyReset",
              actions: ["createUndoState", "resetCell"],
            },
            DIGIT_ENTERED: {
              actions: ["createUndoState", "addOrRemoveGivenDigit"],
            },
            REQUEST_RESET_PUZZLE: {
              cond: "puzzleIsNotAlreadyReset",
              actions: ["createUndoState", "resetPuzzle"],
            },
            REQUEST_SET_PUZZLE_FROM_PUZZLE_STRING: {
              cond: "isValidPuzzleString",
              target: "validatingPuzzle",
              actions: "setPuzzleFromPuzzleString",
            },
            REQUEST_START_SOLVING_PUZZLE: { target: "validatingPuzzle" },
          },
        },
        validatingPuzzle: {
          always: [
            {
              cond: "isValidPuzzle",
              target: "solvingPuzzle",
              actions: ["clearAllHighlights", "resetSolvingState"],
            },
            {
              target: "creatingPuzzle",
              actions: "setErrorStateToInvalidPuzzle",
            },
          ],
        },
        solvingPuzzle: {
          on: {
            REQUEST_CLEAR_CELL: {
              // TODO when version 5 of XState is released, replace this guard
              // with a composite guard (eventIsNotForGivenDigitCell && cellIsNotAlreadyReset)
              cond: "canResetCellWhileSolvingPuzzle",
              actions: ["createUndoState", "resetCell"],
            },
            DIGIT_ENTERED: {
              cond: "eventIsNotForGivenDigitCell",
              actions: ["createUndoState", "addOrRemoveGuessDigit"],
            },
            REQUEST_RESET_PUZZLE: {
              cond: "puzzleHasMarkingUp",
              actions: ["createUndoState", "clearAllMarkingUp"],
            },
            REQUEST_CHECK_PUZZLE: [
              {
                cond: "isSolvedPuzzle",
                target: "solvedPuzzle",
                actions: "clearAllHighlights",
              },
              {
                actions: [
                  "highlightAllCellsWithErrors",
                  "setErrorStateToPuzzleNotSolved",
                ],
              },
            ],
            REQUEST_SAVE_CHECKPOINT: {
              actions: "saveCheckpoint",
            },
            REQUEST_RESTORE_CHECKPOINT: {
              cond: "hasCheckpoint",
              actions: ["createUndoState", "restoreCheckpoint"],
            },
            REQUEST_CLEAR_ALL_HIGHLIGHTS: {
              cond: "hasHighlighting",
              actions: "clearAllHighlights",
            },
            REQUEST_UPDATE_HIGHLIGHTED_DIGIT: {
              actions: "updateHighlightedDigit",
            },
          },
        },
        solvedPuzzle: {
          on: {
            REQUEST_START_ENTERING_PUZZLE: {
              target: "creatingPuzzle",
              actions: "resetAll",
            },
          },
        },
      },
      on: {
        REQUEST_UNDO: { cond: "canUndo", actions: "undo" },
        REQUEST_REDO: { cond: "canRedo", actions: "redo" },
      },
    },
    {
      actions: {
        resetAll: assign<PuzzleContext, PuzzleEvent>({
          puzzle: puzzle.createPuzzle(STANDARD_SUDOKU_CONSTRAINTS),
          undoStack: [],
          redoStack: [],
          checkpointPuzzle: null,
          cellHighlighting: highlighting.createInitialCellHighlighting(),
          errorState: null,
        }),
        resetPuzzle: assign<PuzzleContext, PuzzleEvent>({
          puzzle: puzzle.createPuzzle(STANDARD_SUDOKU_CONSTRAINTS),
        }),
        resetSolvingState: assign<PuzzleContext, PuzzleEvent>({
          undoStack: [],
          redoStack: [],
          checkpointPuzzle: null,
          cellHighlighting: highlighting.createInitialCellHighlighting(),
          errorState: null,
        }),
        createUndoState: assign<PuzzleContext, PuzzleEvent>({
          undoStack: pushCurrentPuzzleStateToUndoStack,
          redoStack: [],
        }),
        undo: assign<PuzzleContext, PuzzleEvent>({
          puzzle: (ctx) => ctx.undoStack[ctx.undoStack.length - 1],
          undoStack: (ctx) => slice(ctx.undoStack, 0, -1),
          redoStack: (ctx) => [...ctx.redoStack, ctx.puzzle],
        }),
        redo: assign<PuzzleContext, PuzzleEvent>({
          puzzle: (ctx) => ctx.redoStack[ctx.redoStack.length - 1],
          undoStack: (ctx) => [...ctx.undoStack, ctx.puzzle],
          redoStack: (ctx) => slice(ctx.redoStack, 0, -1),
        }),
        setErrorStateToInvalidPuzzle: assign<PuzzleContext, PuzzleEvent>({
          errorState: () => ({ error: PuzzleError.INVALID_PUZZLE }),
        }),
        setErrorStateToPuzzleNotSolved: assign<PuzzleContext, PuzzleEvent>({
          errorState: () => ({ error: PuzzleError.PUZZLE_NOT_SOLVED }),
        }),
        clearAllMarkingUp: assign<PuzzleContext, PuzzleEvent>({
          puzzle: (ctx) => puzzle.clearAllMarkingUp(ctx.puzzle),
          cellHighlighting: highlighting.createInitialCellHighlighting(),
        }),
        resetCell: assign<PuzzleContext, PuzzleEvent>({
          puzzle: (ctx, event: RequestClearCellEvent) =>
            puzzle.resetCell(ctx.puzzle, event.payload.index),
        }),
        addOrRemoveGivenDigit: assign<PuzzleContext, PuzzleEvent>({
          puzzle: (ctx, event: DigitEnteredEvent) => {
            const { index, digit } = event.payload;
            return puzzle.addOrRemoveGivenDigit(ctx.puzzle, index, digit);
          },
        }),
        setPuzzleFromPuzzleString: assign<PuzzleContext, PuzzleEvent>({
          puzzle: (_, event: RequestSetPuzzleFromPuzzleStringEvent) =>
            puzzle.createPuzzleFromPuzzleString(event.payload.puzzleString),
        }),
        addOrRemoveGuessDigit: assign<PuzzleContext, PuzzleEvent>({
          puzzle: (ctx, event: DigitEnteredEvent) => {
            const { index, digit, isPencilDigit } = event.payload;
            return puzzle.addOrRemoveGuessDigit(
              ctx.puzzle,
              index,
              digit,
              isPencilDigit,
              true
            );
          },
        }),
        saveCheckpoint: assign<PuzzleContext, PuzzleEvent>({
          checkpointPuzzle: (ctx) => ctx.puzzle,
        }),
        restoreCheckpoint: assign<PuzzleContext, PuzzleEvent>({
          puzzle: (ctx) => ctx.checkpointPuzzle,
        }),
        clearAllHighlights: assign<PuzzleContext, PuzzleEvent>({
          cellHighlighting: () => highlighting.createInitialCellHighlighting(),
        }),
        highlightAllCellsWithErrors: assign<PuzzleContext, PuzzleEvent>({
          cellHighlighting: (ctx) =>
            highlighting.createCellHighlightingForErrors(ctx.puzzle),
        }),
        updateHighlightedDigit: assign<PuzzleContext, PuzzleEvent>({
          cellHighlighting: (ctx, event: RequestUpdateHighlightedDigitEvent) =>
            highlighting.updateHighlightedDigit(
              ctx.cellHighlighting,
              event.payload.digit
            ),
        }),
      },
      guards: {
        isValidPuzzle: (ctx) => puzzle.isValidPuzzle(ctx.puzzle),
        isValidPuzzleString: (
          _,
          event: RequestSetPuzzleFromPuzzleStringEvent
        ) => isValidPuzzleString(event.payload.puzzleString),
        eventIsNotForGivenDigitCell: (
          ctx,
          event: RequestClearCellEvent | DigitEnteredEvent
        ) => !puzzle.puzzleCellIsGivenDigit(ctx.puzzle, event.payload.index),
        isSolvedPuzzle: (ctx) => puzzle.isSolved(ctx.puzzle),
        canUndo: getCanUndo,
        canRedo: getCanRedo,
        hasCheckpoint: getHasCheckpoint,
        hasHighlighting: (ctx) =>
          highlighting.hasHighlighting(ctx.cellHighlighting),
        cellIsNotAlreadyReset: (ctx, event: RequestClearCellEvent) =>
          puzzle.cellIsNotAlreadyReset(ctx.puzzle, event.payload.index),
        puzzleIsNotAlreadyReset: (ctx) =>
          puzzle.puzzleIsNotAlreadyReset(ctx.puzzle),
        puzzleHasMarkingUp: (ctx) => puzzle.puzzleHasMarkingUp(ctx.puzzle),
        // TODO when version 5 of XState is released, replace this guard
        // with a composite guard (eventIsNotForGivenDigitCell && cellIsNotAlreadyReset)
        canResetCellWhileSolvingPuzzle: (ctx, event: RequestClearCellEvent) =>
          !puzzle.puzzleCellIsGivenDigit(ctx.puzzle, event.payload.index) &&
          puzzle.cellIsNotAlreadyReset(ctx.puzzle, event.payload.index),
      },
    }
  ).withContext({
    puzzle: puzzle.createPuzzle(STANDARD_SUDOKU_CONSTRAINTS),
    undoStack: [],
    redoStack: [],
    checkpointPuzzle: null,
    cellHighlighting: highlighting.createInitialCellHighlighting(),
    errorState: null,
  });
}
