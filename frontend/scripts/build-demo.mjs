// Builds the static, browser-only demo into frontend/out.
//
// Server-only parts (API routes, middleware, the dynamic /applications/[id]
// route) can't be statically exported, so the build runs on a temporary copy
// of the app without them. In the demo, /api/* calls are answered in the
// browser by lib/demo/api.ts.
import { spawnSync } from "node:child_process";
import { cpSync, mkdirSync, readdirSync, rmSync, symlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const work = join(root, ".demo-build");
const skip = new Set(["node_modules", ".next", "out", ".demo-build"]);

rmSync(work, { recursive: true, force: true });
mkdirSync(work);
for (const entry of readdirSync(root)) {
	if (!skip.has(entry)) {
		cpSync(join(root, entry), join(work, entry), { recursive: true });
	}
}
symlinkSync(
	join(root, "node_modules"),
	join(work, "node_modules"),
	process.platform === "win32" ? "junction" : "dir",
);

for (const path of ["app/api", "middleware.ts", "app/applications/[id]"]) {
	rmSync(join(work, path), { recursive: true, force: true });
}

const result = spawnSync("npx", ["next", "build"], {
	cwd: work,
	stdio: "inherit",
	shell: process.platform === "win32",
	env: { ...process.env, NEXT_PUBLIC_DEMO_MODE: "true" },
});
if (result.status !== 0) {
	process.exit(result.status ?? 1);
}

rmSync(join(root, "out"), { recursive: true, force: true });
cpSync(join(work, "out"), join(root, "out"), { recursive: true });
rmSync(work, { recursive: true, force: true });
console.log("Demo built in frontend/out");
