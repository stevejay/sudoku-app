import React, { FC, useRef } from "react";
import type { IconType } from "react-icons";
import { useFocusEffect, useRovingTabIndex } from "react-roving-tabindex";
import { Button } from "./button";

type Props = {
  label: string;
  icon?: IconType;
  primary?: boolean;
  disabled?: boolean;
  rowIndex: number;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export const ButtonWithRovingTabIndex: FC<Props> = ({
  label,
  rowIndex,
  icon,
  primary,
  disabled,
  onClick,
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [tabIndex, focused, handleKeyDown, handleClick] = useRovingTabIndex(
    ref,
    disabled,
    rowIndex
  );
  useFocusEffect(focused, ref);
  return (
    <Button
      ref={ref}
      label={label}
      icon={icon}
      disabled={disabled}
      primary={primary}
      compact
      tabIndex={tabIndex}
      onClick={(event) => {
        handleClick();
        onClick(event);
      }}
      onKeyDown={handleKeyDown}
    />
  );
};
