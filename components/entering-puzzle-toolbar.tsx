import { PuzzleSend } from "machines/puzzle-machine.types";
import React, { FC } from "react";
import { faUndoAlt } from "@fortawesome/free-solid-svg-icons";
import { faRedoAlt } from "@fortawesome/free-solid-svg-icons";
import { ToolbarButton } from "./toolbar-button";
import { GetPuzzleLinkToolbarOption } from "./get-puzzle-link-toolbar-option";

type Props = {
  send: PuzzleSend;
  canUndo: boolean;
  canRedo: boolean;
  puzzleUrlGenerator: () => string;
};

export const EnteringPuzzleToolbar: FC<Props> = ({
  send,
  canUndo,
  canRedo,
  puzzleUrlGenerator,
}) => {
  return (
    <div className="flex flex-col justify-between">
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
          label="Reset"
          onClick={() => send({ type: "REQUEST_RESET_PUZZLE" })}
        />
        <GetPuzzleLinkToolbarOption puzzleUrlGenerator={puzzleUrlGenerator} />
        <ToolbarButton
          label="Start solving"
          primary
          onClick={() => send({ type: "REQUEST_START_SOLVING_PUZZLE" })}
        />
      </div>
    </div>
  );
};
