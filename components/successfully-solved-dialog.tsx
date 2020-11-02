import React, { forwardRef } from "react";
import { RenderModalDialogProps } from "react-overlays/Modal";
import { DialogChrome } from "./dialog-chrome";
import { Button } from "./button";

type Props = RenderModalDialogProps & {
  onHide: () => void;
};

export const SuccessfullySolvedDialog = forwardRef<HTMLDivElement, Props>(
  ({ onHide, ...props }, forwardedRef) => (
    <DialogChrome {...props} onHide={onHide} ref={forwardedRef}>
      <div
        role="document"
        className="flex flex-col w-full overflow-y-hidden divide-y divide-gray-800 text-white"
      >
        <h2
          id="successfully-solved-title"
          className="text-2xl font-bold text-purple-400 px-5 sm:px-6 pb-3"
        >
          Well done!
        </h2>
        <div className="overflow-y-scroll w-full space-y-4 text-white px-5 sm:px-6 py-5">
          <p id="successfully-solved-description">
            You successfully solved the puzzle.
          </p>
        </div>
        <div className="flex items-center justify-end px-5 sm:px-6 pt-3">
          <Button label="Close" onClick={onHide} />
        </div>
      </div>
    </DialogChrome>
  )
);
