import React, { cloneElement, ComponentType, isValidElement } from "react";
import { TransitionCallbacks } from "react-overlays/esm/types";
import Transition, { TransitionProps } from "react-transition-group/Transition";

type TransitionComponent = ComponentType<
  {
    in: boolean;
    appear?: boolean;
    unmountOnExit?: boolean;
  } & TransitionCallbacks &
    TransitionProps
>;

const FADE_STYLES = {
  entering: "opacity-100",
  entered: "opacity-100",
};

export const Fade: TransitionComponent = ({ children, ...props }) => (
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
