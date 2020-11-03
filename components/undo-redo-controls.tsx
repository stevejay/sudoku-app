import React, { FC } from "react";
import { FaUndoAlt, FaRedoAlt } from "react-icons/fa";
import { PuzzleSend } from "machines/sudoku-puzzle-machine.types";
import { Button } from "./button";

type Props = {
  send: PuzzleSend;
  canUndo: boolean;
  canRedo: boolean;
};

export const UndoRedoControls: FC<Props> = ({ send, canUndo, canRedo }) => (
  <div className="flex space-x-2">
    <Button
      label="Undo"
      icon={FaUndoAlt}
      compact
      disabled={!canUndo}
      className="w-2/4"
      onClick={() => send({ type: "REQUEST_UNDO" })}
    />
    <Button
      label="Redo"
      icon={FaRedoAlt}
      compact
      disabled={!canRedo}
      className="w-2/4"
      onClick={() => send({ type: "REQUEST_REDO" })}
    />
  </div>
);
