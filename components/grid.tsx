import React, { FC, memo } from "react";
import { RovingTabIndexProvider } from "react-roving-tabindex";
import type { SudokuPuzzle } from "domain/sudoku-puzzle.types";
import type { CellHighlighting } from "domain/cell-highlighting.types";
import type { PuzzleSend } from "machines/sudoku-puzzle-machine.types";
import { GridCell } from "./grid-cell";

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

export const Grid: FC<Props> = memo(
  ({ puzzle, highlighting, send }) => (
    <RovingTabIndexProvider allowFocusOnClick={true}>
      <table
        role="grid"
        aria-label="Sudoku puzzle to solve"
        className="border-collapse select-none flex-shrink-0"
      >
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
