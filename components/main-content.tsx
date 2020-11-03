import React, { useEffect } from "react";
import { useMachine } from "@xstate/react";
import { Grid } from "components/grid";
import { getPuzzleStringFromLocation } from "domain/sudoku-puzzle-string";
import { createPuzzleUrl } from "domain/sudoku-puzzle";
import {
  createSudokuPuzzleMachine,
  getCanUndo,
  getCanRedo,
  getHasCheckpoint,
  getPuzzle,
  getHighlighting,
  getPuzzleIsComplete,
  getIsValidPuzzle,
  getErrorState,
  getCanResetWhileCreating,
} from "machines/sudoku-puzzle-machine";
import {
  PuzzleContext,
  PuzzleEvent,
  PuzzleTypestate,
} from "machines/sudoku-puzzle-machine.types";
import { CreatingPuzzleControls } from "components/creating-puzzle-controls";
import {
  bindKeyboardShortcuts,
  KeyboardShortcutCollection,
} from "components/keyboard-shortcuts";
import { ErrorModal } from "components/error-modal";
import { SolvingPuzzleControls } from "components/solving-puzzle-controls";
import { SolvedPuzzleControls } from "components/solved-puzzle-controls";

export const KEYBOARD_SHORTCUTS: KeyboardShortcutCollection<PuzzleEvent> = [
  {
    keys: ["command+z", "ctrl+z"],
    event: { type: "REQUEST_UNDO" },
  },
  {
    keys: ["command+shift+z", "ctrl+shift+z"],
    event: { type: "REQUEST_REDO" },
  },
];

export const MainContent = () => {
  const [state, send] = useMachine<PuzzleContext, PuzzleEvent, PuzzleTypestate>(
    () => createSudokuPuzzleMachine()
  );

  const context = state.context;
  const puzzle = getPuzzle(context);
  const highlighting = getHighlighting(context);
  const canUndo = getCanUndo(context);
  const canRedo = getCanRedo(context);

  useEffect(() => bindKeyboardShortcuts(KEYBOARD_SHORTCUTS, send), [send]);

  useEffect(() => {
    const puzzleString = getPuzzleStringFromLocation(window.location);
    if (puzzleString) {
      send({
        type: "REQUEST_SET_PUZZLE_FROM_PUZZLE_STRING",
        payload: { puzzleString },
      });
    }
  }, [send]);

  return (
    <main className="flex flex-grow items-center justify-center py-5 sm:py-8">
      <div className="grid grid-flow-row sm:grid-flow-col justify-center gap-8">
        <Grid puzzle={puzzle} highlighting={highlighting} send={send} />
        {state.value === "creatingPuzzle" && (
          <CreatingPuzzleControls
            send={send}
            canUndo={canUndo}
            canRedo={canRedo}
            canReset={getCanResetWhileCreating(context)}
            isValidPuzzle={getIsValidPuzzle(context)}
            puzzleUrlGenerator={() => createPuzzleUrl(puzzle, window.location)}
          />
        )}
        {state.value === "solvingPuzzle" && (
          <SolvingPuzzleControls
            send={send}
            canUndo={canUndo}
            canRedo={canRedo}
            hasCheckpoint={getHasCheckpoint(context)}
            puzzleIsComplete={getPuzzleIsComplete(context)}
            highlighting={highlighting}
          />
        )}
        {state.value === "solvedPuzzle" && <SolvedPuzzleControls send={send} />}
        <ErrorModal errorState={getErrorState(context)} />
      </div>
    </main>
  );
};
