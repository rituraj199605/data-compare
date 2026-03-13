/* ---------------------------------------------------------------
 * Pre-allocated buffers for comparison operations.
 * Rule 3: no dynamic memory allocation after initialization.
 * Rule 1: no recursion.  Rule 2: bounded loops.
 * Rule 8: max 4 functions per file.
 * --------------------------------------------------------------- */

import { MAX_ROWS } from "@/initializers/init-config/initConfig";

/**
 * Fixed-capacity string array used as a reusable scratch buffer.
 * Allocated once at module load; reused across comparisons.
 */
const keyBufferA: string[] = new Array<string>(MAX_ROWS).fill("");
const keyBufferB: string[] = new Array<string>(MAX_ROWS).fill("");

/** Track how many slots are actively used (avoids re-allocation) */
let usedA = 0;
let usedB = 0;

/** Reset buffers before each comparison run. */
export function resetBuffers(): void {
  /* Rule 2: bounded loop — max MAX_ROWS iterations */
  const limitA: number = usedA;
  for (let i = 0; i < limitA; i++) {
    keyBufferA[i] = "";
  }
  const limitB: number = usedB;
  for (let i = 0; i < limitB; i++) {
    keyBufferB[i] = "";
  }
  usedA = 0;
  usedB = 0;
}

/** Write a key into buffer A at the next available slot. */
export function pushKeyA(key: string): boolean {
  if (usedA >= MAX_ROWS) {
    return false;
  }
  keyBufferA[usedA] = key;
  usedA++;
  return true;
}

/** Write a key into buffer B at the next available slot. */
export function pushKeyB(key: string): boolean {
  if (usedB >= MAX_ROWS) {
    return false;
  }
  keyBufferB[usedB] = key;
  usedB++;
  return true;
}

/** Read a key from buffer A. Returns empty string if out of range. */
export function readKeyA(index: number): string {
  if (index < 0 || index >= usedA) {
    return "";
  }
  return keyBufferA[index] ?? "";
}

/** Read a key from buffer B. Returns empty string if out of range. */
export function readKeyB(index: number): string {
  if (index < 0 || index >= usedB) {
    return "";
  }
  return keyBufferB[index] ?? "";
}

/** Return the count of keys stored in A. */
export function countA(): number {
  return usedA;
}

/** Return the count of keys stored in B. */
export function countB(): number {
  return usedB;
}
