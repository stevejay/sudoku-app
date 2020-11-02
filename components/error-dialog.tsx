import React, { forwardRef } from "react";
import { RenderModalDialogProps } from "react-overlays/Modal";
import { DialogChrome } from "./dialog-chrome";
import { PuzzleError } from "machines/sudoku-puzzle-machine.types";
import type { PuzzleContext } from "machines/sudoku-puzzle-machine.types";
import { Button } from "./button";

type Props = RenderModalDialogProps & {
  error: PuzzleContext["errorState"]["error"];
  onHide: () => void;
};

export const ErrorDialog = forwardRef<HTMLDivElement, Props>(
  ({ error, onHide, ...props }, forwardedRef) => (
    <DialogChrome {...props} onHide={onHide} ref={forwardedRef}>
      <div
        role="document"
        className="flex flex-col w-full overflow-y-hidden divide-y divide-gray-800 text-white"
      >
        <h2
          id="error-title"
          className="text-2xl font-bold text-purple-400 px-5 sm:px-6 pb-3"
        >
          Oops!
        </h2>
        <div className="overflow-y-scroll w-full space-y-4 text-white px-5 sm:px-6 py-5">
          {error === PuzzleError.INVALID_PUZZLE && (
            <p id="error-description">
              The entered puzzle is not a valid Sudoku puzzle.
            </p>
          )}
          {error === PuzzleError.PUZZLE_NOT_SOLVED && (
            <p id="error-description">
              Your solution has errors and/or empty cells. Any errors have been
              highlighted.
            </p>
          )}
        </div>
        <div className="flex items-center justify-end px-5 sm:px-6 pt-3">
          <Button label="Close" onClick={onHide} />
        </div>
      </div>
    </DialogChrome>
  )
);
