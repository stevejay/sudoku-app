import React, { FC } from "react";
import type { IconType } from "react-icons";

type Props = {
  href: string;
  label: string;
  icon?: IconType;
  primary?: boolean;
  compact?: boolean;
  disabled?: boolean;
  tabIndex?: number;
  className?: string;
};

export const ButtonLink: FC<Props> = ({
  label,
  icon: Icon,
  href,
  primary,
  compact,
  disabled,
  tabIndex,
  className = "",
}) => (
  <a
    href={href}
    rel="noopener noreferrer"
    target="_blank"
    tabIndex={tabIndex}
    className={`inline-block border border-gray-600 hover:border-gray-400 text-white font-light uppercase py-1 px-3 rounded no-underline focus:outline-none focus:shadow-outline ${
      primary ? "bg-purple-700" : "bg-gray-800"
    } ${compact ? "text-sm" : ""} ${
      disabled
        ? "opacity-25 cursor-not-allowed"
        : "opacity-100 hover:border-gray-400"
    } ${className}`}
  >
    <span className="inline-flex items-center space-x-2">
      {Icon && <Icon size="1rem" />}
      <span>{label}</span>
    </span>
  </a>
);
