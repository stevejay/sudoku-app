import React, { FC, memo } from "react";
import { RovingTabIndexProvider } from "react-roving-tabindex";
import { SudokuPuzzle } from "domain/sudoku-puzzle.types";
import { CellHighlighting } from "domain/cell-highlighting.types";
import { PuzzleSend } from "machines/sudoku-puzzle-machine.types";
import { SudokuGridCell } from "./sudoku-grid-cell";

const INDICES: readonly number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];

type Props = {
  puzzle: SudokuPuzzle;
  highlighting: CellHighlighting;
  send: PuzzleSend;
};

function propsAreEqual(prevProps: Props, nextProps: Props): boolean {
  return (
    prevProps.puzzle === nextProps.puzzle &&
    prevProps.highlighting === nextProps.highlighting &&
    prevProps.send === nextProps.send
  );
}

export const SudokuGrid: FC<Props> = memo(
  ({ puzzle, highlighting, send }) => (
    <RovingTabIndexProvider>
      <table
        role="grid"
        aria-label="Sudoku puzzle to solve"
        className="flex border-collapse select-none"
      >
        <tbody className="flex-grow-0 flex-shrink-0 border-4 border-gray-500">
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
                <SudokuGridCell
                  key={columnIndex}
                  rowIndex={rowIndex}
                  columnIndex={columnIndex}
                  cell={puzzle.cells[rowIndex * 9 + columnIndex]}
                  highlighting={highlighting}
                  send={send}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </RovingTabIndexProvider>
  ),
  propsAreEqual
);
