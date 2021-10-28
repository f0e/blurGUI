const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs-extra');
const path = require('path');

const PROFILES_PATH = '/profiles';

function getProfilesPath() {
  return path.join(app.getPath('userData'), PROFILES_PATH);
}

async function createProfilesPath() {
  await fs.ensureDir(getProfilesPath());
}

ipcMain.handle('get-profiles', async (event) => {
  const profileFilenames = await fs.readdir(getProfilesPath());
  const profileNames = profileFilenames.map(
    (profileFilename) => profileFilename.split('.')[0]
  );
  return profileNames;
});

ipcMain.handle('read-profile', async (event, name) => {
  const profilePath = path.join(getProfilesPath(), `${name}.json`);
  const profile = await fs.readJSON(profilePath);
  return profile;
});

ipcMain.handle('save-profile', async (event, profile) => {
  const profilePath = path.join(getProfilesPath(), `${profile.name}.json`);
  await fs.writeJSON(profilePath, profile);
});

ipcMain.handle('delete-profile', async (event, name) => {
  const profilePath = path.join(getProfilesPath(), `${name}.json`);
  await fs.remove(profilePath);
});

module.exports = {
  createProfilesPath,
};
