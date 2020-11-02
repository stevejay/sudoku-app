import React, { FC } from "react";
import { FaUndoAlt, FaRedoAlt } from "react-icons/fa";
import type { PuzzleSend } from "machines/sudoku-puzzle-machine.types";
import { ToolbarButton } from "./toolbar-button";
import { GetPuzzleLinkToolbarOption } from "./get-puzzle-link-toolbar-option";

type Props = {
  send: PuzzleSend;
  canUndo: boolean;
  canRedo: boolean;
  isValidPuzzle: boolean;
  puzzleUrlGenerator: () => string;
};

export const EnteringPuzzleToolbar: FC<Props> = ({
  send,
  canUndo,
  canRedo,
  isValidPuzzle,
  puzzleUrlGenerator,
}) => (
  <div className="flex flex-col justify-between">
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
        label="Reset"
        onClick={() => send({ type: "REQUEST_RESET_PUZZLE" })}
      />
      <GetPuzzleLinkToolbarOption
        isValidPuzzle={isValidPuzzle}
        puzzleUrlGenerator={puzzleUrlGenerator}
      />
      <ToolbarButton
        label="Start solving"
        primary
        disabled={!isValidPuzzle}
        onClick={() => send({ type: "REQUEST_START_SOLVING_PUZZLE" })}
      />
    </div>
  </div>
);
