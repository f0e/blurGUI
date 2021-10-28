const { app, BrowserWindow } = require('electron');

const path = require('path');
const isDev = require('electron-is-dev');

const { createScriptsPath } = require('./scripts.js');
createScriptsPath();

const { createProfilesPath } = require('./profiles.js');
createProfilesPath();

const { createSettingsPath } = require('./settings.js');
createSettingsPath();

function createWindow() {
  const RESOURCES_PATH = isDev
    ? path.join(__dirname, '../assets')
    : path.join(process.resourcesPath, 'assets');

  const getAssetPath = (...paths) => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  // i made this fun splashscreen but then realised after making it
  // that the app opens too quickly when built. OOPS :)
  let splash;
  if (isDev) {
    splash = new BrowserWindow({
      width: 390,
      height: 250,
      transparent: true,
      frame: false,
      alwaysOnTop: true,
      icon: getAssetPath('icon.png'),
    });

    splash.loadURL(
      isDev
        ? `file://${path.join(__dirname, 'splash.html')}`
        : `file://${path.join(__dirname, '../build/splash.html')}`
    );
  }

  // Create the browser window.
  const win = new BrowserWindow({
    show: false,
    width: 500,
    height: 475,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
      spellcheck: false,
    },
  });

  win.setMenuBarVisibility(false);
  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  // if main window is ready to show, then destroy the splash window and show up the main window
  win.once('ready-to-show', () => {
    if (splash) splash.destroy();
    win.show();
  });
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
