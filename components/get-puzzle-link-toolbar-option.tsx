import React, { FC, useState } from "react";
import Modal from "react-overlays/Modal";
import { ModalBackdrop } from "./modal-backdrop";
import { Fade } from "./transitions";
import { ToolbarButton } from "./toolbar-button";
import { GetPuzzleLinkDialog } from "./get-puzzle-link-dialog";

type Props = {
  isValidPuzzle: boolean;
  puzzleUrlGenerator: () => string;
};

export const GetPuzzleLinkToolbarOption: FC<Props> = ({
  isValidPuzzle,
  puzzleUrlGenerator,
}) => {
  const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);
  const hideModal = () => setShowModal(false);
  return (
    <>
      <ToolbarButton
        label="Get puzzle link"
        disabled={!isValidPuzzle}
        onClick={openModal}
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
          <GetPuzzleLinkDialog
            {...props}
            puzzleUrlGenerator={puzzleUrlGenerator}
            onHide={hideModal}
          />
        )}
      />
    </>
  );
};
