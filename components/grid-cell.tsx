import React, { FC } from "react";
import { useRovingTabIndex, useFocusEffect } from "react-roving-tabindex";
import { getBackgroundShadingClass } from "./get-background-shading-class";
import { Cell, CellValue } from "domain/types";
import { PuzzleSend } from "machines/sudoku-puzzle-machine.types";

const Digit: FC<{ cell: Cell }> = ({ cell }) => (
  <p
    className={`row-span-3 col-span-3 self-center text-3xl text-center ${
      cell.isGivenDigit
        ? `font-sans ${
            cell.shading !== null ? "text-black" : "text-white"
          } sm:text-4xl`
        : `font-cursive ${
            cell.shading !== null ? "text-gray-800" : "text-gray-300"
          } sm:text-5xl`
    }`}
  >
    {cell.digit}
  </p>
);

const DIGITS: CellValue[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const PencilDigits: FC<{ cell: Cell }> = ({ cell }) => (
  <>
    {DIGITS.map((digit) => (
      <p
        key={digit}
        className={`text-xs sm:text-sm text-center ${
          cell.shading !== null ? "text-gray-800" : "text-gray-300"
        } font-cursive leading-3 sm:leading-4`}
      >
        {cell.pencilDigits.includes(digit) ? digit : ""}
      </p>
    ))}
  </>
);

type Props = {
  rowIndex: number;
  columnIndex: number;
  cell: Cell;
  creating: boolean;
  send: PuzzleSend;
};

const GridCell: FC<Props> = ({
  rowIndex,
  columnIndex,
  cell,
  creating,
  send,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  //   const disabled = creating ? false : cell.isGivenDigit;

  const [tabIndex, focused, handleKeyDown, handleClick] = useRovingTabIndex(
    ref,
    false, // disabled,
    rowIndex
  );

  useFocusEffect(focused, ref);

  const keyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key >= "1" && event.key <= "9") {
      send({
        type: "DIGIT_ENTERED",
        payload: {
          index: cell.index,
          digit: parseInt(event.key, 10) as CellValue,
          ctrlKey: event.ctrlKey,
        },
      });
    } else if (event.key === "Backspace") {
      send({ type: "REQUEST_CLEAR_CELL", payload: { index: cell.index } });
    } else {
      handleKeyDown(event);
    }
  };

  return (
    <td
      role="gridcell"
      onClick={handleClick}
      className={`box-content inline-block w-8 h-8 sm:w-12 sm:h-12 p-0 ${
        columnIndex % 3 === 2 && columnIndex < 8
          ? "border-r-4 border-gray-500"
          : "border-r border-gray-700"
      } ${getBackgroundShadingClass(cell.shading)}`}
    >
      <div
        ref={ref}
        tabIndex={tabIndex}
        onKeyDown={keyDown}
        // onKeyDown={(event) => !disabled && keyDown(event)}
        className="relative grid grid-rows-3 grid-cols-3 w-8 h-8 sm:w-12 sm:h-12 focus:outline-none focus:shadow-outline focus:border-blue-500 z-10"
      >
        {cell.digit && <Digit cell={cell} />}
        {!cell.isGivenDigit && <PencilDigits cell={cell} />}
      </div>
    </td>
  );
};

export default React.memo(
  GridCell,
  (prevProps, nextProps) =>
    prevProps.cell === nextProps.cell &&
    prevProps.creating === nextProps.creating
);
