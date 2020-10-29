import { createEmptyCell } from "./grid";
import { CellCollection, CellValue } from "./types";

// A puzzle string is 81 characters long. Each character is either
// a digit (1 to 9 inclusive) or a dot (for no digit). A valid example:
// 9.4..7..2.7..16.....6......4.51..9.............8..32.6......7.....98..1.5..2..8.9

export function isValidPuzzleString(puzzleString: string) {
  return /^[\.1-9]{81}$/.test(puzzleString);
}

export function getPuzzleStringFromLocation(location: Location): string | null {
  const search = location.search;
  const params = new URLSearchParams(search);
  return params.get("puzzle") || null;
}

export function createCellCollectionFromPuzzleString(
  puzzleString: string
): CellCollection {
  return puzzleString.split("").map((char, index) =>
    char === "."
      ? createEmptyCell(index)
      : {
          ...createEmptyCell(index),
          isGivenDigit: true,
          digit: parseInt(char, 10) as CellValue,
        }
  );
}

export function createUrlWithPuzzleString(
  cells: CellCollection,
  location: Location
): string {
  const puzzleString = cells
    .map((cell) => (cell.isGivenDigit ? cell.digit.toString() : "."))
    .join("");
  return `https://${location.host}/?puzzle=${puzzleString}`;
}
