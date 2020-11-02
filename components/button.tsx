import React, { FC } from "react";
import type { IconType } from "react-icons";

type Props = {
  label: string;
  icon?: IconType;
  className?: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export const Button: FC<Props> = ({
  label,
  icon: Icon,
  className,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`inline-block bg-gray-700 border border-gray-600 hover:border-gray-400 text-white font-light uppercase py-1 px-3 rounded focus:outline-none focus:shadow-outline ${className}`}
  >
    <span className="inline-flex items-center space-x-2">
      {Icon && <Icon size="1rem" />}
      <span>{label}</span>
    </span>
  </button>
);
