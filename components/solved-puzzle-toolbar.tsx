import React, { FC, useState } from "react";
import Modal from "react-overlays/Modal";
import type { PuzzleSend } from "machines/sudoku-puzzle-machine.types";
import { ToolbarButton } from "./toolbar-button";
import { SuccessfullySolvedDialog } from "./successfully-solved-dialog";
import { ModalBackdrop } from "./modal-backdrop";
import { Fade } from "./transitions";

type Props = {
  send: PuzzleSend;
};

export const SolvedPuzzleToolbar: FC<Props> = ({ send }) => {
  const [showModal, setShowModal] = useState(true);
  const hideModal = () => setShowModal(false);
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2">
        <ToolbarButton
          label="Enter a new puzzle"
          primary
          onClick={() => send({ type: "REQUEST_START_ENTERING_PUZZLE" })}
        />
        <Modal
          aria-labelledby="get-puzzle-link-title"
          aria-describedby="get-puzzle-link-description"
          show={showModal}
          onHide={hideModal}
          transition={Fade}
          backdropTransition={Fade}
          renderBackdrop={ModalBackdrop}
          renderDialog={(props) => (
            <SuccessfullySolvedDialog {...props} onHide={hideModal} />
          )}
        />
      </div>
    </div>
  );
};
