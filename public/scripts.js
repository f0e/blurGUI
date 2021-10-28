const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs-extra');
const path = require('path');

const SCRIPTS_PATH = '/temp';

function getScriptsPath() {
  return path.join(app.getPath('userData'), SCRIPTS_PATH);
}

async function createScriptsPath() {
  await fs.ensureDir(getScriptsPath());
}

ipcMain.handle('save-script', async (event, filename, script) => {
  const scriptPath = path.join(getScriptsPath(), filename);
  await fs.writeFile(scriptPath, script);
  return scriptPath;
});

ipcMain.handle('delete-script', async (event, filename) => {
  await fs.remove(path.join(getScriptsPath(), filename));
});

module.exports = {
  createScriptsPath,
};
