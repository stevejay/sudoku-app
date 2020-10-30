import React, { useEffect } from "react";
import { useMachine } from "@xstate/react";
import { Grid } from "components/grid";
import { Head } from "components/head";
import { Nav } from "components/nav";
import { getPuzzleStringFromLocation } from "domain/sudoku-puzzle-string";
import { createPuzzleUrl } from "domain/sudoku-puzzle";
import {
  createSudokuPuzzleMachine,
  getCanUndo,
  getCanRedo,
  getHasCheckpoint,
} from "machines/sudoku-puzzle-machine";
import { PuzzleEvent } from "machines/sudoku-puzzle-machine.types";
import { EnteringPuzzleToolbar } from "components/entering-puzzle-toolbar";
import {
  bindKeyboardShortcuts,
  KeyboardShortcutCollection,
} from "components/keyboard-shortcuts";
import { ErrorModal } from "components/error-modal";
import { SolvingPuzzleToolbar } from "components/solving-puzzle-toolbar";

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

const IndexPage = () => {
  const [state, send] = useMachine(() => createSudokuPuzzleMachine());
  const canUndo = getCanUndo(state.context);
  const canRedo = getCanRedo(state.context);
  const hasCheckpoint = getHasCheckpoint(state.context);

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
    <div className="flex flex-col min-h-screen">
      <Head
        title="Sudoku"
        description="Opinionated app for manually solving classic Sudoku puzzles"
      />
      <Nav />
      <main className="w-full flex flex-grow flex-col sm:flex-row items-center sm:items-start sm:justify-center py-6 sm:py-10 space-y-8 sm:space-y-0 sm:space-x-10">
        {state.value === "enteringPuzzle" && (
          <>
            <Grid puzzle={state.context.puzzle} creating send={send} />
            <EnteringPuzzleToolbar
              send={send}
              canUndo={canUndo}
              canRedo={canRedo}
              puzzleUrlGenerator={() =>
                createPuzzleUrl(state.context.puzzle, window.location)
              }
            />
          </>
        )}
        {state.value === "solvingPuzzle" && (
          <>
            <Grid puzzle={state.context.puzzle} creating={false} send={send} />
            <SolvingPuzzleToolbar
              send={send}
              canUndo={canUndo}
              canRedo={canRedo}
              hasCheckpoint={hasCheckpoint}
            />
          </>
        )}
        {/* {state.value === "solvedPuzzle" && <p>Well done!</p>} */}
      </main>
      <ErrorModal errorState={state.context.errorState} />
    </div>
  );
};

export default IndexPage;
