import type { PuzzleString } from "./sudoku-puzzle-string.types";
import type { CellCollection, CellDigit } from "./sudoku-puzzle.types";

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
