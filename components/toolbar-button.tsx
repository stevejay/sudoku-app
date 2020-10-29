import React, { FC } from "react";
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";

type Props = {
  label: string;
  primary?: boolean;
  disabled?: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
} & Partial<Pick<FontAwesomeIconProps, "icon">>;

export const ToolbarButton: FC<Props> = ({
  label,
  icon,
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
      {!!icon && <FontAwesomeIcon icon={icon} size="1x" />}
      <span>{label}</span>
    </span>
  </button>
);
