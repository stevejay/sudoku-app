import { CellCollection, CellDigit } from "./sudoku-puzzle.types";

// A puzzle string is 81 characters long. Each character is either
// a digit (1 to 9 inclusive) or a dot (for no digit). A valid example:
// 9.4..7..2.7..16.....6......4.51..9.............8..32.6......7.....98..1.5..2..8.9

export type PuzzleString = string;

export function isValidPuzzleString(puzzleString: PuzzleString): boolean {
  return /^[\.1-9]{81}$/.test(puzzleString);
}

export function getPuzzleStringFromLocation(
  location: Location
): PuzzleString | null {
  const search = location.search;
  const params = new URLSearchParams(search);
  return params.get("puzzle") || null;
}

export function parsePuzzleString(
  puzzleString: PuzzleString
): readonly (CellDigit | null)[] {
  return puzzleString
    .split("")
    .map((char) => (char === "." ? null : (parseInt(char, 10) as CellDigit)));
}

export function createPuzzleStringFromCellCollection(
  cells: CellCollection
): string {
  return cells
    .map((cell) => (cell.isGivenDigit ? cell.digit.toString() : "."))
    .join("");
}
