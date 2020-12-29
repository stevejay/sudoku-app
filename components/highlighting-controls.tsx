import React, { FC, memo } from "react";
import { RovingTabIndexProvider } from "react-roving-tabindex";
import { CellHighlighting } from "domain/cell-highlighting.types";
import { CellDigit } from "domain/sudoku-puzzle.types";
import { PuzzleSend } from "machines/sudoku-puzzle-machine.types";
import { Button } from "./button";
import { ControlsLabel } from "./controls-label";
import { ButtonWithRovingTabIndex } from "./button-with-roving-tab-index";

const INDICES: readonly number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];

type Props = {
  send: PuzzleSend;
  highlighting: CellHighlighting;
};

function propsAreEqual(prevProps: Props, nextProps: Props): boolean {
  return (
    prevProps.highlighting === nextProps.highlighting &&
    prevProps.send === nextProps.send
  );
}

export const HighlightingControls: FC<Props> = memo(
  ({ send, highlighting }) => (
    <div role="toolbar" aria-labelledby="highlight-label" className="space-y-2">
      <ControlsLabel id="highlight-label" label="Highlight" />
      <div className="grid grid-cols-3 grid-rows-3 gap-2">
        <RovingTabIndexProvider>
          {INDICES.map((index) => (
            <ButtonWithRovingTabIndex
              key={index}
              label={(index + 1).toString()}
              rowIndex={Math.floor(index / 3)}
              primary={index + 1 === highlighting.highlightedDigit}
              onClick={() =>
                send({
                  type: "REQUEST_UPDATE_HIGHLIGHTED_DIGIT",
                  payload: { digit: (index + 1) as CellDigit },
                })
              }
            />
          ))}
        </RovingTabIndexProvider>
      </div>
      <Button
        label="Clear highlights"
        compact
        onClick={() => send({ type: "REQUEST_CLEAR_ALL_HIGHLIGHTS" })}
      />
    </div>
  ),
  propsAreEqual
);
