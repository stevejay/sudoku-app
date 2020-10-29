import React, { FC } from "react";
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";

type Props = {
  label: string;
  href: string;
} & Partial<Pick<FontAwesomeIconProps, "icon">>;

export const LinkButton: FC<Props> = ({ label, icon, href }) => (
  <a
    href={href}
    rel="noopener noreferrer"
    target="_blank"
    className="inline-block bg-gray-700 border border-gray-600 hover:border-gray-400 text-white font-light uppercase py-1 px-3 rounded no-underline focus:outline-none focus:shadow-outline"
  >
    <span className="inline-flex items-center space-x-2">
      {icon && <FontAwesomeIcon icon={icon} size="1x" />}
      <span>{label}</span>
    </span>
  </a>
);
