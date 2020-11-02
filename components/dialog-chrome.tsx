import React, { forwardRef, ReactNode } from "react";
import { RenderModalDialogProps } from "react-overlays/Modal";
import { FaTimes } from "react-icons/fa";

type Props = RenderModalDialogProps & {
  children?: ReactNode;
  onHide?: () => void;
};

export const DialogChrome = forwardRef<HTMLDivElement, Props>(
  ({ onHide, className, children, ...props }, forwardedRef) => (
    <div
      {...props}
      ref={forwardedRef}
      className={`absolute z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col w-10/12 max-w-screen-md max-h-11/12 border border-gray-400 shadow-lg py-5 bg-gray-900 rounded-lg focus:outline-none focus:shadow-outline ${
        className || ""
      }`}
    >
      {!!onHide && (
        <button
          aria-label="Close dialog"
          className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-gray-400 shadow-lg bg-gray-900 focus:outline-none focus:shadow-outline"
          onClick={onHide}
          autoFocus
        >
          <FaTimes className="text-white inline-block" size="1.5rem" />
        </button>
      )}
      {children}
    </div>
  )
);
