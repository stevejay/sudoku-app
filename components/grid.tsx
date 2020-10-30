import React, { FC } from "react";
import { RovingTabIndexProvider } from "react-roving-tabindex";
import GridCell from "./grid-cell";
import { SudokuPuzzle } from "domain/sudoku-puzzle.types";
import { PuzzleSend } from "machines/sudoku-puzzle-machine.types";

const INDICES: readonly number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];

type Props = {
  puzzle: SudokuPuzzle;
  creating: boolean;
  send: PuzzleSend;
};

export const Grid: FC<Props> = ({ puzzle, creating, send }) => (
  <RovingTabIndexProvider allowFocusOnClick={true}>
    <table role="grid" className="border-collapse select-none flex-shrink-0">
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
                cell={puzzle.cells[rowIndex * 9 + columnIndex]}
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
