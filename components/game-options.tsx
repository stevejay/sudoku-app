import React, { FC } from "react";
import { PuzzleSend } from "machines/puzzle-machine.types";

type Props = {
  send: PuzzleSend;
};

export const GameOptions: FC<Props> = ({ send }) => (
  <ul>
    <li>
      <button
        className="border-2 border-blue-500 text-lg py-3 px-5 rounded"
        onClick={() => send({ type: "REQUEST_START_ENTERING_PUZZLE" })}
      >
        Enter your own puzzle
      </button>
    </li>
  </ul>
);
