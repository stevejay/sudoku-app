import React, { FC } from "react";

type Props = {
  label: string;
  id?: string;
};

export const ToolbarLabel: FC<Props> = ({ label, id }) => (
  <label
    id={id}
    className="block text-xs uppercase text-gray-500 border-b border-gray-700"
  >
    {label}
  </label>
);
