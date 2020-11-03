import React, { forwardRef, ReactNode } from "react";
import { RenderModalDialogProps } from "react-overlays/Modal";
import { FaTimes } from "react-icons/fa";

type Props = RenderModalDialogProps & {
  title: string;
  titleId: string;
  renderBody: () => ReactNode;
  renderButtons: () => ReactNode;
  onHide?: () => void;
};

export const BasicDialog = forwardRef<HTMLDivElement, Props>(
  (
    {
      title,
      titleId,
      renderBody,
      renderButtons,
      onHide,
      className = "",
      ...props
    },
    forwardedRef
  ) => (
    <div
      {...props}
      role="document"
      ref={forwardedRef}
      className={`absolute z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col w-10/12 max-w-screen-md max-h-11/12 border border-gray-400 shadow-lg py-5 bg-gray-900 rounded-lg focus:outline-none focus:shadow-outline ${className}`}
    >
      {!!onHide && (
        <button
          aria-label="Close dialog"
          className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-gray-400 bg-gray-900 shadow-lg focus:outline-none focus:shadow-outline"
          onClick={onHide}
          autoFocus
        >
          <FaTimes className="text-white inline-block" size="1.5rem" />
        </button>
      )}
      <div className="flex flex-col w-full overflow-y-hidden divide-y divide-gray-800 text-white">
        <h2
          id={titleId}
          className="text-2xl font-bold text-purple-400 px-5 sm:px-6 pb-3"
        >
          {title}
        </h2>
        <div className="overflow-y-scroll w-full space-y-4 text-white px-5 sm:px-6 py-5">
          {renderBody()}
        </div>
        <div className="flex items-center justify-end px-5 sm:px-6 pt-3">
          {renderButtons()}
        </div>
      </div>
    </div>
  )
);
