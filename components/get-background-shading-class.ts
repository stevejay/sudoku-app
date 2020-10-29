import { Cell } from "domain/types";

export function getBackgroundShadingClass(shading: Cell["shading"]): string {
  switch (shading) {
    case 0:
      return "bg-orange-200";
    case 1:
      return "bg-green-200";
    case 2:
      return "bg-blue-200";
    case 3:
      return "bg-purple-200";
    case 4:
      return "bg-yellow-200";
    default:
      return "";
  }
}
