import React, { FC, useEffect, useState } from "react";
import Modal from "react-overlays/Modal";
import {
  PuzzleContext,
  PuzzleError,
} from "machines/sudoku-puzzle-machine.types";
import { ModalBackdrop } from "./modal/modal-backdrop";
import { FadeTransition } from "./modal/fade-transition";
import { BasicDialog } from "./modal/basic-dialog";
import { Button } from "./button";

function getErrorDescription(errorState: PuzzleContext["errorState"]): string {
  switch (errorState.error) {
    case PuzzleError.INVALID_PUZZLE:
      return "The entered puzzle is not a valid Sudoku puzzle.";
    case PuzzleError.PUZZLE_NOT_SOLVED:
      return " Your solution has errors and/or empty cells. Any errors have been highlighted.";
  }
}

type Props = {
  errorState: PuzzleContext["errorState"];
};

export const ErrorModal: FC<Props> = ({ errorState }) => {
  const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
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
      onHide={closeModal}
      transition={FadeTransition}
      backdropTransition={FadeTransition}
      renderBackdrop={ModalBackdrop}
      renderDialog={(props) => (
        <BasicDialog
          title="Oops!"
          titleId="error-title"
          renderBody={() => (
            <p id="error-description">{getErrorDescription(errorState)}</p>
          )}
          renderButtons={() => <Button label="Close" onClick={closeModal} />}
          onHide={closeModal}
          {...props}
        />
      )}
    />
  );
};
