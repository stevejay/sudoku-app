import React, { FC, useState } from "react";
import Modal from "react-overlays/Modal";
import { PuzzleSend } from "machines/sudoku-puzzle-machine.types";
import { Button } from "./button";
import { ModalBackdrop } from "./modal/modal-backdrop";
import { FadeTransition } from "./modal/fade-transition";
import { BasicDialog } from "./modal/basic-dialog";

type Props = {
  send: PuzzleSend;
};

export const SolvedPuzzleControls: FC<Props> = ({ send }) => {
  const [showModal, setShowModal] = useState(true);
  const closeModal = () => setShowModal(false);
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2">
        <Button
          label="Enter a new puzzle"
          primary
          compact
          onClick={() => send({ type: "REQUEST_START_ENTERING_PUZZLE" })}
        />
        <Modal
          aria-labelledby="successfully-solved-title"
          aria-describedby="successfully-solved-description"
          show={showModal}
          onHide={closeModal}
          transition={FadeTransition}
          backdropTransition={FadeTransition}
          renderBackdrop={ModalBackdrop}
          renderDialog={(props) => (
            <BasicDialog
              title="Well done!"
              titleId="successfully-solved-title"
              renderBody={() => (
                <p id="successfully-solved-description">
                  You successfully solved the puzzle.
                </p>
              )}
              renderButtons={() => (
                <Button label="Close" onClick={closeModal} />
              )}
              onHide={closeModal}
              {...props}
            />
          )}
        />
      </div>
    </div>
  );
};
