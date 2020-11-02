import React, { useState } from "react";
import Modal from "react-overlays/Modal";
import { FaGithub, FaQuestionCircle } from "react-icons/fa";
import { Button } from "./button";
import { LinkButton } from "./link-button";
import { InstructionDialog } from "./instruction-dialog";
import { ModalBackdrop } from "./modal-backdrop";
import { Fade } from "./transitions";

export const Nav = () => {
  const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);
  const hideModal = () => setShowModal(false);
  return (
    <nav className="bg-gray-800 p-3 sm:px-6">
      <ul className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 justify-between sm:items-center">
        <li>
          <h1 className="text-white font-thin text-2xl sm:text-3xl">Sudoku</h1>
        </li>
        <li>
          <ul className="flex justify-center space-x-4">
            <li>
              <Button
                label="Instructions"
                icon={FaQuestionCircle}
                onClick={openModal}
              />
              <Modal
                aria-labelledby="instructions-title"
                show={showModal}
                onHide={hideModal}
                transition={Fade}
                backdropTransition={Fade}
                renderBackdrop={ModalBackdrop}
                renderDialog={(props) => (
                  <InstructionDialog {...props} onHide={hideModal} />
                )}
              />
            </li>
            <li>
              <LinkButton
                label="GitHub"
                icon={FaGithub}
                href="https://github.com/stevejay/sudoku-app"
              />
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
};
