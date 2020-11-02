import React, { FC, useEffect, useState } from "react";
import Modal from "react-overlays/Modal";
import { ModalBackdrop } from "./modal-backdrop";
import { Fade } from "./transitions";
import type { PuzzleContext } from "machines/sudoku-puzzle-machine.types";
import { ErrorDialog } from "./error-dialog";

type Props = {
  errorState: PuzzleContext["errorState"];
};

export const ErrorModal: FC<Props> = ({ errorState }) => {
  const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);
  const hideModal = () => setShowModal(false);
  useEffect(() => {
    if (errorState) {
      openModal();
    }
  }, [errorState]);
  return (
    <Modal
      role="alertdialog"
      aria-labelledby="error-title"
      aria-describedby="error-description"
      aria-atomic
      show={showModal}
      onHide={hideModal}
      transition={Fade}
      backdropTransition={Fade}
      renderBackdrop={ModalBackdrop}
      renderDialog={(props) => (
        <ErrorDialog {...props} error={errorState.error} onHide={hideModal} />
      )}
    />
  );
};
