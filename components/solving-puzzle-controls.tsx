import React, { FC } from "react";
import { CellHighlighting } from "domain/cell-highlighting.types";
import { PuzzleSend } from "machines/sudoku-puzzle-machine.types";
import { Button } from "./button";
import { UndoRedoControls } from "./undo-redo-controls";
import { CheckpointControls } from "./checkpoint-controls";
import { HighlightingControls } from "./highlighting-controls";

type Props = {
  send: PuzzleSend;
  canUndo: boolean;
  canRedo: boolean;
  hasCheckpoint: boolean;
  highlighting: CellHighlighting;
  puzzleIsComplete: boolean;
};

export const SolvingPuzzleControls: FC<Props> = ({
  send,
  canUndo,
  canRedo,
  hasCheckpoint,
  highlighting,
  puzzleIsComplete,
}) => (
  <div className="flex flex-col space-y-6 sm:justify-between">
    <div className="flex flex-col space-y-6">
      <HighlightingControls send={send} highlighting={highlighting} />
      <CheckpointControls send={send} hasCheckpoint={hasCheckpoint} />
    </div>
    <div className="flex flex-col space-y-2">
      <UndoRedoControls send={send} canUndo={canUndo} canRedo={canRedo} />
      <Button
        label="Reset"
        compact
        onClick={() => send({ type: "REQUEST_RESET_PUZZLE" })}
      />
      <Button
        label="Check puzzle"
        primary
        compact
        disabled={!puzzleIsComplete}
        onClick={() => send({ type: "REQUEST_CHECK_PUZZLE" })}
      />
    </div>
  </div>
);
