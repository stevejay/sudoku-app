import React, { FC } from "react";
import { PuzzleSend } from "machines/sudoku-puzzle-machine.types";
import { Button } from "./button";
import { GetPuzzleLinkButton } from "./get-puzzle-link-button";
import { UndoRedoControls } from "./undo-redo-controls";

type Props = {
  send: PuzzleSend;
  canUndo: boolean;
  canRedo: boolean;
  canReset: boolean;
  isValidPuzzle: boolean;
  puzzleUrlGenerator: () => string;
};

export const CreatingPuzzleControls: FC<Props> = ({
  send,
  canUndo,
  canRedo,
  canReset,
  isValidPuzzle,
  puzzleUrlGenerator,
}) => (
  <div className="flex flex-col justify-between">
    <div className="flex flex-col space-y-2">
      <UndoRedoControls send={send} canUndo={canUndo} canRedo={canRedo} />
      <Button
        label="Reset"
        compact
        disabled={!canReset}
        onClick={() => send({ type: "REQUEST_RESET_PUZZLE" })}
      />
      <GetPuzzleLinkButton
        isValidPuzzle={isValidPuzzle}
        puzzleUrlGenerator={puzzleUrlGenerator}
      />
      <Button
        label="Start solving"
        primary
        compact
        disabled={!isValidPuzzle}
        onClick={() => send({ type: "REQUEST_START_SOLVING_PUZZLE" })}
      />
    </div>
  </div>
);
