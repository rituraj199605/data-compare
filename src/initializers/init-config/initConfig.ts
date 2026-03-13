/* ---------------------------------------------------------------
 * Application configuration constants.
 * Rule 3: All limits defined at init, no dynamic allocation later.
 * Rule 8: max 4 functions per file.
 * --------------------------------------------------------------- */

/** Maximum rows per uploaded file */
export const MAX_ROWS = 500_000;

/** Maximum columns per uploaded file */
export const MAX_COLUMNS = 200;

/** Maximum file size in bytes (100 MB) */
export const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024;

/** Rows per page in the detail view */
export const PAGE_SIZE = 50;

/** Supported file extensions */
export const SUPPORTED_EXTENSIONS: readonly string[] = [".csv", ".xlsx"];

/** Maximum key columns for composite key */
export const MAX_KEY_COLUMNS = 10;
