// Apply Tracker for Windows: wraps the static demo build (desktop/app) in a
// desktop window. Data is stored in the app's own browser storage on this PC.
const { app, BrowserWindow, protocol, net, shell, dialog } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("node:path");
const fs = require("node:fs");
const { pathToFileURL } = require("node:url");

const SCHEME = "app";
const HOST = "tracker";
const appDir = path.join(__dirname, "app");

// A standard, secure scheme gives the app a stable origin, so absolute paths
// like /_next/... resolve and localStorage persists between launches.
protocol.registerSchemesAsPrivileged([
	{
		scheme: SCHEME,
		privileges: { standard: true, secure: true, supportFetchAPI: true },
	},
]);

function resolveFile(urlPath) {
	const decoded = decodeURIComponent(urlPath);
	const target = path.normalize(path.join(appDir, decoded));
	if (!target.startsWith(appDir)) {
		return null;
	}
	const candidates = [target, path.join(target, "index.html"), `${target}.html`];
	return candidates.find((file) => fs.existsSync(file) && fs.statSync(file).isFile()) ?? null;
}

function registerAppProtocol() {
	protocol.handle(SCHEME, (request) => {
		const { pathname } = new URL(request.url);
		const file = resolveFile(pathname) ?? path.join(appDir, "404.html");
		return net.fetch(pathToFileURL(file).toString());
	});
}

function createWindow() {
	const win = new BrowserWindow({
		width: 1400,
		height: 900,
		minWidth: 1024,
		minHeight: 700,
		title: "Apply Tracker",
		autoHideMenuBar: true,
		webPreferences: { contextIsolation: true, sandbox: true },
	});

	// Open external links (job postings) in the default browser.
	win.webContents.setWindowOpenHandler(({ url }) => {
		if (!url.startsWith(`${SCHEME}://`)) {
			shell.openExternal(url);
		}
		return { action: "deny" };
	});
	win.webContents.on("will-navigate", (event, url) => {
		if (!url.startsWith(`${SCHEME}://`)) {
			event.preventDefault();
			shell.openExternal(url);
		}
	});

	win.loadURL(`${SCHEME}://${HOST}/dashboard/`);
}

function setupAutoUpdates() {
	if (!app.isPackaged) {
		return;
	}

	autoUpdater.on("update-downloaded", async (info) => {
		const { response } = await dialog.showMessageBox({
			type: "info",
			buttons: ["Restart now", "Later"],
			defaultId: 0,
			title: "Update ready",
			message: `Apply Tracker ${info.version} has been downloaded.`,
			detail: "Restart to install it. Your data is kept.",
		});
		if (response === 0) {
			autoUpdater.quitAndInstall();
		}
	});
	autoUpdater.on("error", () => {
		// Offline or no release yet: try again next launch.
	});

	autoUpdater.checkForUpdates().catch(() => {});
}

if (!app.requestSingleInstanceLock()) {
	app.quit();
} else {
	app.on("second-instance", () => {
		const [win] = BrowserWindow.getAllWindows();
		if (win) {
			if (win.isMinimized()) win.restore();
			win.focus();
		}
	});

	app.whenReady().then(() => {
		registerAppProtocol();
		createWindow();
		setupAutoUpdates();
	});

	app.on("window-all-closed", () => app.quit());
}
