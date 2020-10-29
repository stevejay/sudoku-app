import range from "lodash/range";
import slice from "lodash/slice";
import { actions, assign, createMachine } from "xstate";
import { STANDARD_SUDOKU_CONSTRAINTS } from "domain/constraints";
import {
  createCellCollectionFromPuzzleString,
  isValidPuzzleString,
} from "domain/puzzle-string";
import {
  addGivenDigitToCell,
  addGuessDigitToCell,
  clearAllHighlights,
  resetCell,
  createInitialCellCollection,
  hasHighlighting,
  highlightAllCellsForDigit,
  highlightAllCellsWithErrors,
  isSolved,
  isValidPuzzle,
  clearAllMarkingUp,
} from "domain/grid";
import {
  PuzzleContext,
  PuzzleError,
  PuzzleEvent,
  PuzzleTypestate,
  DigitEnteredEvent,
  RequestClearCellEvent,
  RequestHighlightAllCellsWithDigitEvent,
  RequestSetPuzzleFromPuzzleStringEvent,
} from "./puzzle-machine.types";

export function getCanUndo(ctx: PuzzleContext): boolean {
  return !!ctx.undoStack.length;
}

export function getCanRedo(ctx: PuzzleContext): boolean {
  return !!ctx.redoStack.length;
}

export function getHasCheckpoint(ctx: PuzzleContext): boolean {
  return !!ctx.checkpointCells && !!ctx.checkpointCells.length;
}

function pushCurrentCellsToUndoStack(ctx: PuzzleContext) {
  const MAX_UNDO_STACK_LENGTH = 100;
  const newUndoStack = slice(
    ctx.undoStack,
    ctx.undoStack.length >= MAX_UNDO_STACK_LENGTH
      ? ctx.undoStack.length - (MAX_UNDO_STACK_LENGTH - 1)
      : 0
  );
  newUndoStack.push(ctx.cells);
  return newUndoStack;
}

// todo
// - adding a big guess number must clear all pencil digits in constraints?
// - completing a number should do something?

export function createPuzzleMachine() {
  return createMachine<PuzzleContext, PuzzleEvent, PuzzleTypestate>(
    {
      initial: "initialising",
      states: {
        initialising: {
          always: {
            target: "enteringPuzzle",
            actions: "reset",
          },
        },
        enteringPuzzle: {
          on: {
            REQUEST_CLEAR_CELL: { actions: ["createUndoState", "resetCell"] },
            DIGIT_ENTERED: {
              actions: ["createUndoState", "addGivenDigitToCell"],
            },
            REQUEST_RESET_PUZZLE: { actions: "reset" },
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
              actions: ["createUndoState", "addDigitToCell"],
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
              actions: "reset",
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
        reset: assign<PuzzleContext, PuzzleEvent>({
          cells: createInitialCellCollection(),
          undoStack: [],
          redoStack: [],
          checkpointCells: null,
          errorState: null,
        }),
        createUndoState: assign<PuzzleContext, PuzzleEvent>({
          undoStack: pushCurrentCellsToUndoStack,
          redoStack: [],
        }),
        undo: assign<PuzzleContext, PuzzleEvent>({
          cells: (ctx) => ctx.undoStack[ctx.undoStack.length - 1],
          undoStack: (ctx) => slice(ctx.undoStack, 0, -1),
          redoStack: (ctx) => [...ctx.redoStack, ctx.cells],
        }),
        redo: assign<PuzzleContext, PuzzleEvent>({
          cells: (ctx) => ctx.redoStack[ctx.redoStack.length - 1],
          undoStack: (ctx) => [...ctx.undoStack, ctx.cells],
          redoStack: (ctx) => slice(ctx.redoStack, 0, -1),
        }),
        clearAllMarkingUp: assign<PuzzleContext, PuzzleEvent>({
          cells: (ctx) => clearAllMarkingUp(ctx.cells),
        }),
        setErrorStateToInvalidPuzzle: assign<PuzzleContext, PuzzleEvent>({
          errorState: () => ({ error: PuzzleError.INVALID_PUZZLE }),
        }),
        setErrorStateToPuzzleNotSolved: assign<PuzzleContext, PuzzleEvent>({
          errorState: () => ({ error: PuzzleError.PUZZLE_NOT_SOLVED }),
        }),
        resetCell: assign<PuzzleContext, PuzzleEvent>({
          cells: (ctx, event: RequestClearCellEvent) =>
            resetCell(ctx.cells, event.payload.index),
        }),
        addGivenDigitToCell: assign<PuzzleContext, PuzzleEvent>({
          cells: (ctx, event: DigitEnteredEvent) => {
            const { index, digit } = event.payload;
            return addGivenDigitToCell(ctx.cells, index, digit);
          },
        }),
        setPuzzleFromPuzzleString: assign<PuzzleContext, PuzzleEvent>({
          cells: (_, event: RequestSetPuzzleFromPuzzleStringEvent) =>
            createCellCollectionFromPuzzleString(event.payload.puzzleString),
        }),
        addDigitToCell: assign<PuzzleContext, PuzzleEvent>({
          cells: (ctx, event: DigitEnteredEvent) => {
            const { index, digit, ctrlKey } = event.payload;
            return addGuessDigitToCell(ctx.cells, index, digit, !ctrlKey);
          },
        }),
        saveCheckpoint: assign<PuzzleContext, PuzzleEvent>({
          checkpointCells: (ctx) => ctx.cells,
        }),
        restoreCheckpoint: assign<PuzzleContext, PuzzleEvent>({
          cells: (ctx) => ctx.checkpointCells,
        }),
        clearAllHighlights: assign<PuzzleContext, PuzzleEvent>({
          cells: (ctx) => clearAllHighlights(ctx.cells),
        }),
        highlightAllCellsWithErrors: assign<PuzzleContext, PuzzleEvent>({
          cells: (ctx) =>
            highlightAllCellsWithErrors(ctx.cells, STANDARD_SUDOKU_CONSTRAINTS),
        }),
        highlightAllCellsForDigit: assign<PuzzleContext, PuzzleEvent>({
          cells: (ctx, event: RequestHighlightAllCellsWithDigitEvent) =>
            highlightAllCellsForDigit(ctx.cells, event.payload.digit),
        }),
      },
      guards: {
        isValidPuzzle: (ctx) =>
          isValidPuzzle(ctx.cells, STANDARD_SUDOKU_CONSTRAINTS),
        isValidPuzzleString: (
          _,
          event: RequestSetPuzzleFromPuzzleStringEvent
        ) => isValidPuzzleString(event.payload.puzzleString),
        eventIsNotForGivenDigitCell: (
          ctx,
          event: RequestClearCellEvent | DigitEnteredEvent
        ) => {
          const cell = ctx.cells[event.payload.index];
          return !cell.isGivenDigit;
        },
        isSolvedPuzzle: (ctx) =>
          isSolved(ctx.cells, STANDARD_SUDOKU_CONSTRAINTS),
        canUndo: getCanUndo,
        canRedo: getCanRedo,
        hasCheckpoint: getHasCheckpoint,
        hasHighlighting: (ctx) => hasHighlighting(ctx.cells),
      },
    }
  );
}
