import React, { cloneElement, FC, isValidElement } from "react";
import type { TransitionCallbacks } from "react-overlays/esm/types";
import Transition, { TransitionProps } from "react-transition-group/Transition";

const FADE_STYLES = {
  entering: "opacity-100",
  entered: "opacity-100",
};

type Props = {
  in: boolean;
  appear?: boolean;
  unmountOnExit?: boolean;
} & TransitionCallbacks &
  TransitionProps;

export const FadeTransition: FC<Props> = ({ children, ...props }) => (
  <Transition {...props} timeout={200}>
    {(status) =>
      isValidElement(children)
        ? cloneElement(children, {
            className: `opacity-0 transition-opacity duration-200 ${
              FADE_STYLES[status]
            } ${children.props.className || ""}`,
          })
        : null
    }
  </Transition>
);
