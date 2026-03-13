/* ---------------------------------------------------------------
 * cn: utility for merging Tailwind classes.
 * Rule 8: max 4 functions.
 * --------------------------------------------------------------- */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
