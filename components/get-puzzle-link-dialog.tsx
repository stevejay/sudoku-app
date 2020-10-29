import React, { useState, forwardRef } from "react";
import { RenderModalDialogProps } from "react-overlays/Modal";
import {
  faClipboard,
  faClipboardCheck,
} from "@fortawesome/free-solid-svg-icons";
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
        <article className="overflow-y-scroll w-full space-y-4 text-white px-5 sm:px-8">
          <h2 className="text-2xl font-bold text-purple-400">Puzzle Link</h2>
          <Button
            label={copied ? "Copied to clipboard" : "Copy to clipboard"}
            icon={copied ? faClipboardCheck : faClipboard}
            className={copied ? "bg-green-700" : ""}
            onClick={copyToClipboard}
          />
          <div className="flex items-center justify-end pt-5 border-t border-gray-800">
            <Button label="Close" onClick={onHide} />
          </div>
        </article>
      </DialogChrome>
    );
  }
);
