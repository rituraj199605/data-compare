/* ---------------------------------------------------------------
 * allocateBuffers: wrapper to prepare comparison buffers.
 * Rule 9: function in own folder.
 * Rule 3: no dynamic allocation after init — this resets only.
 * Rule 8: max 4 functions.
 * --------------------------------------------------------------- */

import { resetBuffers } from "@/initializers/init-buffers/initBuffers";

/**
 * Prepare buffers for a new comparison run.
 * Resets pre-allocated buffers; does NOT allocate new memory.
 */
export function allocateBuffers(): boolean {
  try {
    resetBuffers();
    return true;
  } catch {
    return false;
  }
}
