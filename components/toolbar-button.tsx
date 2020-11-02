import React, { FC } from "react";
import type { IconType } from "react-icons";

type Props = {
  label: string;
  icon?: IconType;
  primary?: boolean;
  disabled?: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export const ToolbarButton: FC<Props> = ({
  label,
  icon: Icon,
  primary,
  disabled,
  onClick,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`inline-block border border-gray-600 text-white text-sm font-light uppercase py-1 px-3 rounded focus:outline-none focus:shadow-outline ${
      primary ? "bg-purple-700" : "bg-gray-800"
    } ${disabled ? "opacity-25" : "opacity-100 hover:border-gray-400"}`}
  >
    <span className="inline-flex items-center space-x-2">
      {!!Icon && <Icon size="1rem" />}
      <span>{label}</span>
    </span>
  </button>
);
