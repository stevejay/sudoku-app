import React, { FC, forwardRef, memo, useRef } from "react";
import { useRovingTabIndex, useFocusEffect } from "react-roving-tabindex";
import { Cell, CellDigit } from "domain/sudoku-puzzle.types";
import { CellHighlighting } from "domain/cell-highlighting.types";
import { isHighlightedCell } from "domain/cell-highlighting";
import { PuzzleSend } from "machines/sudoku-puzzle-machine.types";

function createAriaLabelForCell(
  cell: Cell,
  rowIndex: number,
  columnIndex: number
): string {
  const positionText = `Row number ${rowIndex + 1}, column number ${
    columnIndex + 1
  }.`;
  if (cell.isGivenDigit) {
    return `${positionText} Given digit ${cell.digit}.`;
  }
  if (cell.digit) {
    return `${positionText} Guess digit ${cell.digit}.`;
  }
  if (cell.pencilDigits.length) {
    return `${positionText} Possible digits ${cell.pencilDigits.join(", ")}.`;
  }
  return `${positionText} Empty.`;
}

const DigitGridCellContent: FC<{ cell: Cell }> = ({ cell }) => (
  <p
    className={`row-span-3 col-span-3 self-center text-3xl text-center ${
      cell.isGivenDigit
        ? "font-sans text-white sm:text-4xl"
        : "font-cursive text-gray-400 sm:text-5xl"
    }`}
  >
    {cell.digit}
  </p>
);

const DIGITS: CellDigit[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const PencilDigitsGridCellContent: FC<{ cell: Cell }> = ({ cell }) => (
  <>
    {DIGITS.map((digit) => (
      <p
        key={digit}
        className="text-xs sm:text-sm text-center text-gray-400 font-cursive leading-3 sm:leading-4"
      >
        {cell.pencilDigits.includes(digit) ? digit : ""}
      </p>
    ))}
  </>
);

type ImplProps = {
  rowIndex: number;
  columnIndex: number;
  cell: Cell;
  highlighting: CellHighlighting;
  send: PuzzleSend;
  tabIndex: number;
  onKeyDown: (event: React.KeyboardEvent<Element>) => void;
  onClick: () => void;
};

function propsAreEqual(prevProps: ImplProps, nextProps: ImplProps): boolean {
  return (
    prevProps.cell === nextProps.cell &&
    prevProps.highlighting === nextProps.highlighting &&
    prevProps.tabIndex === nextProps.tabIndex &&
    prevProps.send === nextProps.send
  );
}

const GridCellImpl = memo(
  forwardRef<HTMLDivElement, ImplProps>(
    (
      {
        rowIndex,
        columnIndex,
        cell,
        highlighting,
        send,
        tabIndex,
        onKeyDown,
        onClick,
      },
      forwardRef
    ) => {
      const keyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key >= "1" && event.key <= "9") {
          send({
            type: "DIGIT_ENTERED",
            payload: {
              index: cell.index,
              digit: parseInt(event.key, 10) as CellDigit,
              isPencilDigit: !event.ctrlKey && !event.metaKey && !event.altKey,
            },
          });
        } else if (event.key === "Backspace") {
          send({ type: "REQUEST_CLEAR_CELL", payload: { index: cell.index } });
        } else {
          onKeyDown(event);
        }
      };

      const isHighlighted = isHighlightedCell(highlighting, cell);

      return (
        <td
          role="gridcell"
          aria-label={createAriaLabelForCell(cell, rowIndex, columnIndex)}
          className={`box-content inline-block w-8 h-8 sm:w-12 sm:h-12 p-0 ${
            columnIndex % 3 === 2 && columnIndex < 8
              ? "border-r-4 border-gray-500"
              : "border-r border-gray-700"
          } ${isHighlighted ? "shadow-inset-highlight" : ""}`}
        >
          <div
            ref={forwardRef}
            tabIndex={tabIndex}
            onKeyDown={keyDown}
            onClick={onClick}
            className="relative grid grid-rows-3 grid-cols-3 w-8 h-8 sm:w-12 sm:h-12 focus:outline-none focus:ring focus:border-blue-500 z-10"
          >
            {cell.digit && <DigitGridCellContent cell={cell} />}
            {!!cell.pencilDigits.length && (
              <PencilDigitsGridCellContent cell={cell} />
            )}
          </div>
        </td>
      );
    }
  ),
  propsAreEqual
);

type Props = {
  rowIndex: number;
  columnIndex: number;
  cell: Cell;
  highlighting: CellHighlighting;
  send: PuzzleSend;
};

export const SudokuGridCell: FC<Props> = ({
  rowIndex,
  columnIndex,
  cell,
  highlighting,
  send,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [tabIndex, focused, handleKeyDown, handleClick] = useRovingTabIndex(
    ref,
    false,
    rowIndex
  );
  useFocusEffect(focused, ref);
  return (
    <GridCellImpl
      ref={ref}
      tabIndex={tabIndex}
      rowIndex={rowIndex}
      columnIndex={columnIndex}
      cell={cell}
      highlighting={highlighting}
      send={send}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
    />
  );
};
