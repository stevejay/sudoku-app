import React, { FC } from "react";
import { RenderModalBackdropProps } from "react-overlays/Modal";

export const ModalBackdrop: FC<RenderModalBackdropProps> = (props) => (
  <div {...props} className="fixed inset-0 z-40 bg-black bg-opacity-75" />
);
