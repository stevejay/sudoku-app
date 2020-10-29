import React, { ReactNode } from "react";
import { RenderModalDialogProps } from "react-overlays/Modal";
import { Button } from "./button";
import { DialogChrome } from "./dialog-chrome";

type Props = RenderModalDialogProps & {
  children?: ReactNode;
  onHide: () => void;
};

export const InstructionDialog = React.forwardRef<HTMLDivElement, Props>(
  ({ onHide, ...props }, forwardedRef) => (
    <DialogChrome {...props} onHide={onHide} ref={forwardedRef}>
      <article className="overflow-y-scroll w-full space-y-4 text-white px-5 sm:px-8">
        <h2 className="text-2xl font-bold text-purple-400">Instructions</h2>
        <p>
          First enter a puzzle and then try to solve it. Note that this site
          only supports entering classic Sudoku puzzles. In classic Sudoku, each
          number between 1 and 9 inclusive can only appear once in each row,
          each column, and each 3 by 3 region (of which there are nine).
        </p>
        <h3 className="text-lg font-bold">General controls</h3>
        <p>
          To select a cell, use the mouse, or the Tab key in combination with
          the arrow keys (Up, Down, Left, and Right). You can use the arrow keys
          (Up, Down, Left, and Right) to move between cells.
        </p>

        <h3 className="text-lg font-bold">Entering a puzzle</h3>
        <p>
          Entering a puzzle means entering all the given digits of the puzzle
          into the grid. For each given digit, use the mouse or the Tab key to
          select its cell. Now press the appropriate number key (1 to 9) to
          input that digit. Repeat this process for all of the given digits.
        </p>
        <p>
          You can use the arrow keys (Up, Down, Left, and Right) to move between
          cells. To erase a digit, select its cell and then press the same
          number key.
        </p>
        <p>
          You can press the 'Reset' button to clear the entire grid. Once you
          have entered all of the given digits, press the 'Start solving'
          button.
        </p>
        <h3 className="text-lg font-bold">Solving the puzzle</h3>
        <p>
          Solving the puzzle means filling in all of the empty cells with the
          correct digits. For each empty cell, you can either enter multiple
          possible digits in the form of 'pencil' digits, or enter a single
          large digit.
        </p>
        <p>
          To enter pencil digits, use the mouse or the Tab key to select a cell.
          Now press the appropriate number key (1 to 9) to input that digit into
          the cell as a pencil digit. You can enter multiple pencil digits in
          each empty cell. When you think that you know what the digit in a cell
          should be, select it and then press the appropriate number key (1 to
          9) and the Ctrl key at the same time.
        </p>
        <p>
          You can use the arrow keys (Up, Down, Left, and Right) to move between
          cells. To erase a pencil digit from a cell, select that cell and then
          press the same number key as that digit. To erase a large digit, do
          the same but press the Ctrl key at the same time.
        </p>
        <p>
          You can use the 'Reset' button to clear the entire grid and start
          again.
        </p>
        <div className="flex items-center justify-end pt-5 border-t border-gray-800">
          <Button label="Close" onClick={onHide} />
        </div>
      </article>
    </DialogChrome>
  )
);
