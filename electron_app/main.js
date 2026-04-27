const { app, BrowserWindow, Menu } = require("electron");
const path = require("node:path");

if (process.env.npm_lifecycle_event === "dev") {
  const electronBinary = process.platform === "win32"
    ? path.join(__dirname, "node_modules", ".bin", "electron.cmd")
    : path.join(__dirname, "node_modules", ".bin", "electron");

  require("electron-reload")(__dirname, {
    electron: electronBinary
  });
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 460,
    height: 250,
    backgroundColor: "#e4d1b8",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.webContents.on("context-menu", (_event, params) => {
    const menu = Menu.buildFromTemplate([
      {
        label: "Always on Top",
        type: "checkbox",
        checked: mainWindow.isAlwaysOnTop(),
        click: (menuItem) => {
          mainWindow.setAlwaysOnTop(menuItem.checked);
        }
      },
      { type: "separator" },
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      { role: "selectAll" },
      ...(process.env.npm_lifecycle_event === "dev"
        ? [
            { type: "separator" },
            {
              label: "Inspect Element",
              click: () => {
                mainWindow.webContents.inspectElement(params.x, params.y);
              }
            }
          ]
        : [])
    ]);

    menu.popup({ window: mainWindow });
  });

  mainWindow.loadFile(path.join(__dirname, "renderer", "index.html"));
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
