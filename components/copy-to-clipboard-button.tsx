import React, { useState, FC } from "react";
import { FaClipboard, FaClipboardCheck } from "react-icons/fa";
import { Button } from "./button";

type Props = {
  dataGenerator: () => string;
};

export const CopyToClipboardButton: FC<Props> = ({ dataGenerator }) => {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(dataGenerator())
      .then(() => setCopied(true))
      .catch(console.error);
  };
  return (
    <Button
      label={copied ? "Copied to clipboard" : "Copy to clipboard"}
      icon={copied ? FaClipboardCheck : FaClipboard}
      className={copied ? "bg-green-700" : ""}
      onClick={copyToClipboard}
    />
  );
};
