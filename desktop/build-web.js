// Builds the web app for the desktop (browser storage, starts empty, no demo
// banner) and copies it into desktop/app.
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const frontend = path.join(__dirname, "..", "frontend");
const target = path.join(__dirname, "app");

const result = spawnSync("npm", ["run", "build:demo"], {
	cwd: frontend,
	stdio: "inherit",
	shell: process.platform === "win32",
	env: { ...process.env, NEXT_PUBLIC_DESKTOP: "true" },
});
if (result.status !== 0) {
	process.exit(result.status ?? 1);
}

fs.rmSync(target, { recursive: true, force: true });
fs.cpSync(path.join(frontend, "out"), target, { recursive: true });
console.log("Copied desktop web build to desktop/app");
