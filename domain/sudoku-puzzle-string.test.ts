import _ from "lodash";
import {
  createBlankCell,
  createGivenDigitCell,
  VALID_PUZZLE_STRING,
} from "testing/domain-testing-utils";
import {
  createPuzzleStringFromCellCollection,
  getPuzzleStringFromLocation,
  isValidPuzzleString,
  parsePuzzleString,
} from "./sudoku-puzzle-string";
import { CellCollection, CellDigit } from "./sudoku-puzzle.types";

const BASIC_PUZZLE_STRING =
  "123456789" +
  _.range(9, 81)
    .map(() => ".")
    .join("");

test.each([
  ["", false],
  ["123456789", false],
  [".", false],
  [
    "9.4..7..2.7..16.....6......4.51..9.............8..32.6......7.....98..1.5..2..8.",
    false,
  ],
  [
    "9.4..7..2.7..16.....6......4.51..9.............8..32.6......7.....98..1.5..2..8.9.",
    false,
  ],
  [VALID_PUZZLE_STRING, true],
])("isValidPuzzleString", (str, expected) => {
  expect(isValidPuzzleString(str)).toEqual(expected);
});

describe("getPuzzleStringFromLocation", () => {
  describe("when the location has a puzzle string", () => {
    it("should get the string", () => {
      const mockLocation = {
        search: `?puzzle=${VALID_PUZZLE_STRING}`,
      } as Location;
      const result = getPuzzleStringFromLocation(mockLocation);
      expect(result).toEqual(VALID_PUZZLE_STRING);
    });
  });

  describe("when the location does not have a puzzle string", () => {
    it("should return null", () => {
      const mockLocation = { search: "?foo=bar" } as Location;
      const result = getPuzzleStringFromLocation(mockLocation);
      expect(result).toBeNull();
    });
  });
});

describe("parsePuzzleString", () => {
  it("should parse the string", () => {
    const result = parsePuzzleString(BASIC_PUZZLE_STRING);
    expect(result).toEqual<CellDigit[]>([
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      ..._.range(9, 81).map(() => null),
    ]);
  });
});

describe("createPuzzleStringFromCellCollection", () => {
  it("should create the puzzle string", () => {
    const cellCollection: CellCollection = [
      createGivenDigitCell(0, 1),
      createGivenDigitCell(1, 2),
      createGivenDigitCell(2, 3),
      createGivenDigitCell(3, 4),
      createGivenDigitCell(4, 5),
      createGivenDigitCell(5, 6),
      createGivenDigitCell(6, 7),
      createGivenDigitCell(7, 8),
      createGivenDigitCell(8, 9),
      ..._.range(9, 81).map(createBlankCell),
    ];
    const result = createPuzzleStringFromCellCollection(cellCollection);
    expect(result).toEqual(BASIC_PUZZLE_STRING);
  });
});
