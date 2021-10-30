const { app, ipcMain } = require('electron');
const fs = require('fs-extra');
const path = require('path');

const SETTINGS_PATH = '/settings/settings.json';

function getSettingsFile() {
  return path.join(app.getPath('userData'), SETTINGS_PATH);
}

async function createSettingsPath() {
  await fs.ensureDir(path.dirname(getSettingsFile()));
}

ipcMain.handle('get-settings', async (event) => {
  const filePath = getSettingsFile();
  if (!fs.existsSync(filePath)) return null;
  return fs.readJSON(filePath);
});

ipcMain.handle('save-settings', async (event, settings) => {
  return fs.writeJSON(getSettingsFile(), settings);
});

module.exports = {
  createSettingsPath,
};
