import React, { forwardRef } from "react";
import type { IconType } from "react-icons";

type Props = {
  label: string;
  icon?: IconType;
  primary?: boolean;
  compact?: boolean;
  disabled?: boolean;
  tabIndex?: number;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      label,
      icon: Icon,
      primary,
      compact,
      disabled,
      tabIndex,
      className = "",
      onClick,
      onKeyDown,
    },
    forwardRef
  ) => (
    <button
      ref={forwardRef}
      tabIndex={tabIndex}
      onClick={onClick}
      onKeyDown={onKeyDown}
      disabled={disabled}
      className={`inline-block border border-gray-600 text-white font-light uppercase py-1 px-3 rounded focus:outline-none focus:shadow-outline ${
        primary ? "bg-purple-700" : "bg-gray-800"
      } ${compact ? "text-sm" : ""} ${
        disabled
          ? "opacity-25 cursor-not-allowed"
          : "opacity-100 hover:border-gray-400"
      } ${className}`}
    >
      <span className="inline-flex items-center space-x-2">
        {!!Icon && <Icon size="1rem" />}
        <span>{label}</span>
      </span>
    </button>
  )
);
