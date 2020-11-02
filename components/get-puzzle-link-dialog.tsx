import React, { useState, forwardRef } from "react";
import { RenderModalDialogProps } from "react-overlays/Modal";
import { FaClipboard, FaClipboardCheck } from "react-icons/fa";
import { DialogChrome } from "./dialog-chrome";
import { Button } from "./button";

type Props = RenderModalDialogProps & {
  puzzleUrlGenerator: () => string;
  onHide: () => void;
};

export const GetPuzzleLinkDialog = forwardRef<HTMLDivElement, Props>(
  ({ puzzleUrlGenerator, onHide, ...props }, forwardedRef) => {
    const [copied, setCopied] = useState(false);
    const copyToClipboard = () => {
      navigator.clipboard
        .writeText(puzzleUrlGenerator())
        .then(() => setCopied(true))
        .catch(console.error);
    };
    return (
      <DialogChrome {...props} onHide={onHide} ref={forwardedRef}>
        <div
          role="document"
          className="overflow-y-scroll w-full space-y-4 text-white px-5 sm:px-8"
        >
          <h2
            id="get-puzzle-link-title"
            className="text-2xl font-bold text-purple-400"
          >
            Puzzle Link
          </h2>
          <p id="get-puzzle-link-description">
            Click 'Copy to clipboard' to copy the URL for this puzzle to the
            clipboard.
          </p>
          <Button
            label={copied ? "Copied to clipboard" : "Copy to clipboard"}
            icon={copied ? FaClipboardCheck : FaClipboard}
            className={copied ? "bg-green-700" : ""}
            onClick={copyToClipboard}
          />
          <div className="flex items-center justify-end pt-5 border-t border-gray-800">
            <Button label="Close" onClick={onHide} />
          </div>
        </div>
      </DialogChrome>
    );
  }
);
