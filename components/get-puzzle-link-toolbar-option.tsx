import React, { FC, useState } from "react";
import Modal from "react-overlays/Modal";
import { ModalBackdrop } from "./modal-backdrop";
import { Fade } from "./transitions";
import { ToolbarButton } from "./toolbar-button";
import { GetPuzzleLinkDialog } from "./get-puzzle-link-dialog";

type Props = {
  puzzleUrlGenerator: () => string;
};

export const GetPuzzleLinkToolbarOption: FC<Props> = ({
  puzzleUrlGenerator,
}) => {
  const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);
  const hideModal = () => setShowModal(false);
  return (
    <>
      <ToolbarButton label="Get puzzle link" onClick={openModal} />
      <Modal
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
