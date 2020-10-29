import React from "react";
import { TransitionCallbacks } from "react-overlays/esm/types";
import Transition, { TransitionProps } from "react-transition-group/Transition";

type TransitionComponent = React.ComponentType<
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
      React.isValidElement(children)
        ? React.cloneElement(children, {
            className: `opacity-0 transition-opacity duration-200 ${FADE_STYLES[status]} ${children.props.className}`,
          })
        : null
    }
  </Transition>
);
