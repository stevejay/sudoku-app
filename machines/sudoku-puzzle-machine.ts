import slice from "lodash/slice";
import { actions, assign, createMachine } from "xstate";
import { STANDARD_SUDOKU_CONSTRAINTS } from "domain/sudoku-constraints";
import { isValidPuzzleString } from "domain/sudoku-puzzle-string";
import * as puzzle from "domain/sudoku-puzzle";
import {
  PuzzleContext,
  PuzzleError,
  PuzzleEvent,
  PuzzleTypestate,
  DigitEnteredEvent,
  RequestClearCellEvent,
  RequestHighlightAllCellsWithDigitEvent,
  RequestSetPuzzleFromPuzzleStringEvent,
} from "./sudoku-puzzle-machine.types";

export function getCanUndo(ctx: PuzzleContext): boolean {
  return !!ctx.undoStack.length;
}

export function getCanRedo(ctx: PuzzleContext): boolean {
  return !!ctx.redoStack.length;
}

export function getHasCheckpoint(ctx: PuzzleContext): boolean {
  return !!ctx.checkpointPuzzle;
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

// todo
// - completing a number should do something?

export function createSudokuPuzzleMachine() {
  return createMachine<PuzzleContext, PuzzleEvent, PuzzleTypestate>(
    {
      initial: "enteringPuzzle",
      states: {
        enteringPuzzle: {
          on: {
            REQUEST_CLEAR_CELL: { actions: ["createUndoState", "resetCell"] },
            DIGIT_ENTERED: {
              actions: ["createUndoState", "addGivenDigitToCell"],
            },
            REQUEST_RESET_PUZZLE: {
              actions: ["createUndoState", "resetPuzzleState"],
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
            },
            {
              target: "enteringPuzzle",
              actions: "setErrorStateToInvalidPuzzle",
            },
          ],
        },
        solvingPuzzle: {
          on: {
            REQUEST_CLEAR_CELL: {
              cond: "eventIsNotForGivenDigitCell",
              actions: ["createUndoState", "resetCell"],
            },
            DIGIT_ENTERED: {
              cond: "eventIsNotForGivenDigitCell",
              actions: ["createUndoState", "addOrRemoveGuessDigit"],
            },
            REQUEST_RESET_PUZZLE: {
              actions: ["createUndoState", "clearAllMarkingUp"],
            },
            REQUEST_CHECK_PUZZLE: [
              { cond: "isSolvedPuzzle", target: "solvedPuzzle" },
              {
                actions: [
                  "createUndoState",
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
              actions: ["createUndoState", "clearAllHighlights"],
            },
            REQUEST_HIGHLIGHT_ALL_CELLS_WITH_DIGIT: {
              actions: ["createUndoState", "highlightAllCellsForDigit"],
            },
          },
        },
        solvedPuzzle: {
          on: {
            REQUEST_START_ENTERING_PUZZLE: {
              target: "enteringPuzzle",
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
          errorState: null,
        }),
        resetPuzzle: assign<PuzzleContext, PuzzleEvent>({
          puzzle: puzzle.createPuzzle(STANDARD_SUDOKU_CONSTRAINTS),
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
        }),
        resetCell: assign<PuzzleContext, PuzzleEvent>({
          puzzle: (ctx, event: RequestClearCellEvent) =>
            puzzle.resetCell(ctx.puzzle, event.payload.index),
        }),
        addGivenDigitToCell: assign<PuzzleContext, PuzzleEvent>({
          puzzle: (ctx, event: DigitEnteredEvent) => {
            const { index, digit } = event.payload;
            return puzzle.addGivenDigitToCell(ctx.puzzle, index, digit);
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
          puzzle: (ctx) => puzzle.clearAllHighlights(ctx.puzzle),
        }),
        highlightAllCellsWithErrors: assign<PuzzleContext, PuzzleEvent>({
          puzzle: (ctx) => puzzle.highlightAllCellsWithErrors(ctx.puzzle),
        }),
        highlightAllCellsForDigit: assign<PuzzleContext, PuzzleEvent>({
          puzzle: (ctx, event: RequestHighlightAllCellsWithDigitEvent) =>
            puzzle.highlightAllCellsForDigit(ctx.puzzle, event.payload.digit),
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
        hasHighlighting: (ctx) => puzzle.hasHighlighting(ctx.puzzle),
      },
    }
  ).withContext({
    puzzle: puzzle.createPuzzle(STANDARD_SUDOKU_CONSTRAINTS),
    undoStack: [],
    redoStack: [],
    checkpointPuzzle: null,
    errorState: null,
  });
}
