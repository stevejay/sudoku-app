import React, { FC, useState } from "react";
import Modal from "react-overlays/Modal";
import { ModalBackdrop } from "./modal/modal-backdrop";
import { FadeTransition } from "./modal/fade-transition";
import { Button } from "./button";
import { BasicDialog } from "./modal/basic-dialog";
import { CopyToClipboardButton } from "./copy-to-clipboard-button";

type Props = {
  isValidPuzzle: boolean;
  puzzleUrlGenerator: () => string;
};

export const GetPuzzleLinkButton: FC<Props> = ({
  isValidPuzzle,
  puzzleUrlGenerator,
}) => {
  const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  return (
    <>
      <Button
        label="Get puzzle link"
        compact
        disabled={!isValidPuzzle}
        onClick={openModal}
      />
      <Modal
        aria-labelledby="get-puzzle-link-title"
        aria-describedby="get-puzzle-link-description"
        show={showModal}
        onHide={closeModal}
        transition={FadeTransition}
        backdropTransition={FadeTransition}
        renderBackdrop={ModalBackdrop}
        renderDialog={(props) => (
          <BasicDialog
            title="Puzzle Link"
            titleId="get-puzzle-link-title"
            renderBody={() => (
              <>
                <p id="get-puzzle-link-description">
                  Click 'Copy to clipboard' to copy the URL for this puzzle to
                  the clipboard.
                </p>
                <CopyToClipboardButton dataGenerator={puzzleUrlGenerator} />
              </>
            )}
            renderButtons={() => <Button label="Close" onClick={closeModal} />}
            onHide={closeModal}
            {...props}
          />
        )}
      />
    </>
  );
};
