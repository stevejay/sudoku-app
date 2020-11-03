import { PuzzleSend } from "machines/sudoku-puzzle-machine.types";
import React, { FC } from "react";
import { Button } from "./button";
import { ControlsLabel } from "./controls-label";

type Props = {
  send: PuzzleSend;
  hasCheckpoint: boolean;
};

export const CheckpointControls: FC<Props> = ({ send, hasCheckpoint }) => (
  <div role="toolbar" aria-labelledby="checkpoint-label" className="space-y-2">
    <ControlsLabel id="checkpoint-label" label="Checkpoint" />
    <div className="flex space-x-2">
      <Button
        label="Save"
        compact
        onClick={() => send({ type: "REQUEST_SAVE_CHECKPOINT" })}
      />
      <Button
        label="Restore"
        disabled={!hasCheckpoint}
        compact
        onClick={() => send({ type: "REQUEST_RESTORE_CHECKPOINT" })}
      />
    </div>
  </div>
);
