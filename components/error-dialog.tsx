import React, { forwardRef } from "react";
import { RenderModalDialogProps } from "react-overlays/Modal";
import { DialogChrome } from "./dialog-chrome";
import {
  PuzzleContext,
  PuzzleError,
} from "machines/sudoku-puzzle-machine.types";
import { Button } from "./button";

type Props = RenderModalDialogProps & {
  error: PuzzleContext["errorState"]["error"];
  onHide: () => void;
};

export const ErrorDialog = forwardRef<HTMLDivElement, Props>(
  ({ error, onHide, ...props }, forwardedRef) => (
    <DialogChrome {...props} onHide={onHide} ref={forwardedRef}>
      <article className="overflow-y-scroll w-full space-y-4 text-white px-5 sm:px-8">
        <h2 className="text-2xl font-bold text-purple-400">Oops!</h2>
        {error === PuzzleError.INVALID_PUZZLE && (
          <p>The entered puzzle is not a valid Sudoku puzzle.</p>
        )}
        {error === PuzzleError.PUZZLE_NOT_SOLVED && (
          <p>Your solution has errors. These have been highlighted.</p>
        )}
        <div className="flex items-center justify-end pt-5 border-t border-gray-800">
          <Button label="Close" onClick={onHide} />
        </div>
      </article>
    </DialogChrome>
  )
);
