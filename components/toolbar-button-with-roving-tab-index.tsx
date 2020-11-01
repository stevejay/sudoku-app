import React, { FC } from "react";
// import {
//   FontAwesomeIcon,
//   FontAwesomeIconProps,
// } from "@fortawesome/react-fontawesome";
import type { IconType } from "react-icons";
import { useFocusEffect, useRovingTabIndex } from "react-roving-tabindex";

type Props = {
  label: string;
  icon?: IconType;
  disabled?: boolean;
  rowIndex: number;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export const ToolbarButtonWithRovingTabIndex: FC<Props> = ({
  label,
  rowIndex,
  icon: Icon,
  disabled,
  onClick,
}) => {
  const ref = React.useRef<HTMLButtonElement>(null);

  const [tabIndex, focused, handleKeyDown, handleClick] = useRovingTabIndex(
    ref,
    disabled,
    rowIndex
  );

  useFocusEffect(focused, ref);

  return (
    <button
      ref={ref}
      tabIndex={tabIndex}
      onClick={(event) => {
        handleClick();
        onClick(event);
      }}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      className={`inline-block border border-gray-600 text-white text-sm font-light uppercase py-1 px-3 rounded focus:outline-none focus:shadow-outline bg-gray-800 ${
        disabled ? "opacity-25" : "opacity-100 hover:border-gray-400"
      }`}
    >
      <span className="inline-flex items-center space-x-2">
        {!!Icon && <Icon size="1rem" />}
        <span>{label}</span>
      </span>
    </button>
  );
};
