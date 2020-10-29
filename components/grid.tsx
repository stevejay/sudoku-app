import React, { FC } from "react";
import { RovingTabIndexProvider } from "react-roving-tabindex";
import GridCell from "./grid-cell";
import { CellCollection } from "domain/types";
import { PuzzleSend } from "machines/puzzle-machine.types";

const INDICES: readonly number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];

type Props = {
  cells: CellCollection;
  creating: boolean;
  send: PuzzleSend;
};

export const Grid: FC<Props> = ({ cells, creating, send }) => (
  <RovingTabIndexProvider allowFocusOnClick={true}>
    <table role="grid" className="border-collapse select-none">
      <tbody className="border-4 border-gray-500">
        {INDICES.map((rowIndex) => (
          <tr
            key={rowIndex}
            className={
              rowIndex % 3 === 2 && rowIndex < 8
                ? "border-b-4 border-gray-500"
                : "border-b border-gray-700"
            }
          >
            {INDICES.map((columnIndex) => (
              <GridCell
                key={columnIndex}
                rowIndex={rowIndex}
                columnIndex={columnIndex}
                cell={cells[rowIndex * 9 + columnIndex]}
                creating={creating}
                send={send}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </RovingTabIndexProvider>
);
