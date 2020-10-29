import React, { FC } from "react";
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";

type Props = {
  label: string;
  className?: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
} & Partial<Pick<FontAwesomeIconProps, "icon">>;

export const Button: FC<Props> = ({ label, icon, className, onClick }) => (
  <button
    onClick={onClick}
    className={`inline-block bg-gray-700 border border-gray-600 hover:border-gray-400 text-white font-light uppercase py-1 px-3 rounded focus:outline-none focus:shadow-outline ${className}`}
  >
    <span className="inline-flex items-center space-x-2">
      {icon && <FontAwesomeIcon icon={icon} size="1x" />}
      <span>{label}</span>
    </span>
  </button>
);
