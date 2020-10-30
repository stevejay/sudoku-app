import { STANDARD_SUDOKU_CONSTRAINTS } from "domain/sudoku-constraints";
import { createPuzzle } from "domain/sudoku-puzzle";
import {
  INVALID_PUZZLE_STRING,
  VALID_PUZZLE_STRING,
} from "testing/domain-testing-utils";
import { interpret, Interpreter } from "xstate";
import { createSudokuPuzzleMachine } from "./sudoku-puzzle-machine";
import {
  PuzzleContext,
  PuzzleError,
  PuzzleEvent,
  PuzzleTypestate,
} from "./sudoku-puzzle-machine.types";

type InterpreterType = Interpreter<
  PuzzleContext,
  any,
  PuzzleEvent,
  PuzzleTypestate
>;

function initialiseMachine(): InterpreterType {
  return interpret<PuzzleContext, any, PuzzleEvent, PuzzleTypestate>(
    createSudokuPuzzleMachine()
  ).start();
}

describe("sudokuPuzzleMachine", () => {
  let service: InterpreterType = null;
  let context: PuzzleContext = null;
  let stateValue: any = null;

  beforeEach(() => {
    service = initialiseMachine();
    service.subscribe((state) => {
      context = state.context;
      stateValue = state.value;
    });
  });

  describe("when started", () => {
    it("should have the correct initial state", () => {
      expect(stateValue).toEqual("enteringPuzzle");
      expect(context).toEqual<PuzzleContext>({
        puzzle: createPuzzle(STANDARD_SUDOKU_CONSTRAINTS),
        undoStack: [],
        redoStack: [],
        checkpointPuzzle: null,
        errorState: null,
      });
    });
  });

  describe("when entering the puzzle using a puzzle string", () => {
    describe("when the puzzle string is not possibly valid", () => {
      it("should ignore the puzzle string", () => {
        service.send({
          type: "REQUEST_SET_PUZZLE_FROM_PUZZLE_STRING",
          payload: { puzzleString: "not possibly valid" },
        });
        expect(stateValue).toEqual("enteringPuzzle");
        expect(context.errorState).toBeNull();
      });
    });

    describe("when the puzzle string is possibly valid", () => {
      describe("when the puzzle string creates an invalid puzzle", () => {
        it("should set the correct error state", () => {
          service.send({
            type: "REQUEST_SET_PUZZLE_FROM_PUZZLE_STRING",
            payload: { puzzleString: INVALID_PUZZLE_STRING },
          });
          expect(stateValue).toEqual("enteringPuzzle");
          expect(context.errorState).toEqual({
            error: PuzzleError.INVALID_PUZZLE,
          });
        });
      });

      describe("when the puzzle string creates a valid puzzle", () => {
        it("should advance to the solvingPuzzle state", () => {
          service.send({
            type: "REQUEST_SET_PUZZLE_FROM_PUZZLE_STRING",
            payload: { puzzleString: VALID_PUZZLE_STRING },
          });
          expect(stateValue).toEqual("solvingPuzzle");
          expect(context.errorState).toBeNull();
          expect(context.puzzle.constraints).toEqual(
            STANDARD_SUDOKU_CONSTRAINTS
          );
          expect(context.puzzle.cells.length).toEqual(81);
        });
      });
    });
  });
});
