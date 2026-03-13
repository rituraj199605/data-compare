#!/usr/bin/env node
/* ---------------------------------------------------------------
 * setup.js — Generate a password hash for the admin user.
 * Uses Node built-in crypto (no external dependencies needed).
 * Run: node setup.js <your-password>
 * --------------------------------------------------------------- */

const crypto = require("crypto");

const password = process.argv[2];
if (!password) {
  console.error("Usage: node setup.js <password>");
  process.exit(1);
}

const salt = crypto.randomBytes(16).toString("hex");
const hash = crypto.scryptSync(password, salt, 64).toString("hex");
const stored = salt + ":" + hash;

console.log("\nGenerated hash:\n");
console.log(stored);
console.log("\nAdd this to your .env.local as:");
console.log(`ADMIN_PASSWORD_HASH=${stored}\n`);

/* Verify it works */
const [s, h] = stored.split(":");
const verify = crypto.scryptSync(password, s, 64).toString("hex");
if (verify === h) {
  console.log("Verification: PASSED\n");
} else {
  console.error("Verification: FAILED\n");
  process.exit(1);
}
