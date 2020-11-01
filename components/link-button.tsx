import React, { FC } from "react";
import type { IconType } from "react-icons";
// import {
//   FontAwesomeIcon,
//   FontAwesomeIconProps,
// } from "@fortawesome/react-fontawesome";

type Props = {
  label: string;
  icon?: IconType;
  href: string;
};

export const LinkButton: FC<Props> = ({ label, icon: Icon, href }) => (
  <a
    href={href}
    rel="noopener noreferrer"
    target="_blank"
    className="inline-block bg-gray-700 border border-gray-600 hover:border-gray-400 text-white font-light uppercase py-1 px-3 rounded no-underline focus:outline-none focus:shadow-outline"
  >
    <span className="inline-flex items-center space-x-2">
      {Icon && <Icon size="1rem" />}
      <span>{label}</span>
    </span>
  </a>
);
