import React, { FC } from "react";
import { RenderModalBackdropProps } from "react-overlays/Modal";

export const ModalBackdrop: FC<RenderModalBackdropProps> = (props) => (
  <div {...props} className="fixed z-40 inset-0 bg-black bg-opacity-75" />
);
