import { PuzzleSend } from "machines/puzzle-machine.types";
import React, { FC } from "react";
import { faUndoAlt } from "@fortawesome/free-solid-svg-icons";
import { faRedoAlt } from "@fortawesome/free-solid-svg-icons";
import { ToolbarButton } from "./toolbar-button";
import { ToolbarLabel } from "./toolbar-label";
import { RovingTabIndexProvider } from "react-roving-tabindex";
import { ToolbarButtonWithRovingTabIndex } from "./toolbar-button-with-roving-tab-index";
import { CellValue } from "domain/types";

const INDICES: readonly number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];

type Props = {
  send: PuzzleSend;
  canUndo: boolean;
  canRedo: boolean;
  hasCheckpoint: boolean;
};

export const SolvingPuzzleToolbar: FC<Props> = ({
  send,
  canUndo,
  canRedo,
  hasCheckpoint,
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
                  type: "REQUEST_HIGHLIGHT_ALL_CELLS_WITH_DIGIT",
                  // TODO find a way around this cast:
                  payload: { digit: (index + 1) as CellValue },
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
          icon={faUndoAlt}
          disabled={!canUndo}
          onClick={() => send({ type: "REQUEST_UNDO" })}
        />
        <ToolbarButton
          label="Redo"
          icon={faRedoAlt}
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
        onClick={() => send({ type: "REQUEST_CHECK_PUZZLE" })}
      />
    </div>
  </div>
);
