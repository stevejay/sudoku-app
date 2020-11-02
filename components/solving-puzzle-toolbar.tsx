import type { PuzzleSend } from "machines/sudoku-puzzle-machine.types";
import React, { FC } from "react";
import { FaUndoAlt, FaRedoAlt } from "react-icons/fa";
import { RovingTabIndexProvider } from "react-roving-tabindex";
import type { CellHighlighting } from "domain/cell-highlighting.types";
import type { CellDigit } from "domain/sudoku-puzzle.types";
import { ToolbarButton } from "./toolbar-button";
import { ToolbarLabel } from "./toolbar-label";
import { ToolbarButtonWithRovingTabIndex } from "./toolbar-button-with-roving-tab-index";

const INDICES: readonly number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];

// TODO split into separate controls.

type Props = {
  send: PuzzleSend;
  canUndo: boolean;
  canRedo: boolean;
  hasCheckpoint: boolean;
  highlighting: CellHighlighting;
  puzzleIsComplete: boolean;
};

export const SolvingPuzzleToolbar: FC<Props> = ({
  send,
  canUndo,
  canRedo,
  hasCheckpoint,
  puzzleIsComplete,
}) => (
  <div className="flex flex-col space-y-6">
    <div role="toolbar" aria-labelledby="highlight-label" className="space-y-2">
      <ToolbarLabel id="highlight-label" label="Highlight" />
      <div className="grid grid-cols-3 grid-rows-3 gap-2">
        <RovingTabIndexProvider allowFocusOnClick={true}>
          {INDICES.map((index) => (
            <ToolbarButtonWithRovingTabIndex
              key={index}
              label={(index + 1).toString()}
              rowIndex={Math.floor(index / 3)}
              onClick={() =>
                send({
                  type: "REQUEST_UPDATE_HIGHLIGHTED_DIGIT",
                  // TODO find a way around this cast:
                  payload: { digit: (index + 1) as CellDigit },
                })
              }
            />
          ))}
        </RovingTabIndexProvider>
      </div>
    </div>
    <div
      role="toolbar"
      aria-labelledby="checkpoint-label"
      className="space-y-2"
    >
      <ToolbarLabel id="checkpoint-label" label="Checkpoint" />
      <div className="flex space-x-2">
        <ToolbarButton
          label="Save"
          onClick={() => send({ type: "REQUEST_SAVE_CHECKPOINT" })}
        />
        <ToolbarButton
          label="Restore"
          disabled={!hasCheckpoint}
          onClick={() => send({ type: "REQUEST_RESTORE_CHECKPOINT" })}
        />
      </div>
    </div>
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between space-x-2">
        <ToolbarButton
          label="Undo"
          icon={FaUndoAlt}
          disabled={!canUndo}
          onClick={() => send({ type: "REQUEST_UNDO" })}
        />
        <ToolbarButton
          label="Redo"
          icon={FaRedoAlt}
          disabled={!canRedo}
          onClick={() => send({ type: "REQUEST_REDO" })}
        />
      </div>
      <ToolbarButton
        label="Clear highlights"
        onClick={() => send({ type: "REQUEST_CLEAR_ALL_HIGHLIGHTS" })}
      />
      <ToolbarButton
        label="Reset"
        onClick={() => send({ type: "REQUEST_RESET_PUZZLE" })}
      />
      <ToolbarButton
        label="Check puzzle"
        primary
        disabled={!puzzleIsComplete}
        onClick={() => send({ type: "REQUEST_CHECK_PUZZLE" })}
      />
    </div>
  </div>
);
