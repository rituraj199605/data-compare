#!/usr/bin/env node
/* ---------------------------------------------------------------
 * setup.js — Generate a bcrypt hash for the admin password.
 * Run: node setup.js <your-password>
 * --------------------------------------------------------------- */

const bcrypt = require("bcryptjs");

const password = process.argv[2];
if (!password) {
  console.error("Usage: node setup.js <password>");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);
console.log("\nGenerated hash:\n");
console.log(hash);
console.log("\nAdd this to your .env.local as:");
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
