import { createContext, FunctionComponent, useEffect, useState } from 'react';
import Settings from '../types/Settings';

const ipcRenderer = window.require('electron').ipcRenderer;

export interface ISettingsContext {
  getSettings: () => Settings;
  updateSettings: () => Promise<void>;
  saveSettings: (settings: Settings) => void;
}

const SettingsContext = createContext({} as ISettingsContext);

export const SettingsStore: FunctionComponent = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(new Settings());

  // load settings on startup
  useEffect(() => {
    updateSettings();
    // todo: fix this error properly
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getSettings = () => {
    if (!settings) throw new Error("couldn't get settings");
    return settings;
  };

  const updateSettings = async () => {
    let settingsJSON: string = await ipcRenderer.invoke('get-settings');

    if (!settingsJSON) {
      // couldn't get settings, save default settings
      await saveSettings(settings);
      return;
    }

    const newSettings = Object.assign(new Settings(), settingsJSON);
    setSettings(newSettings);
  };

  const saveSettings = async (settings: Settings) => {
    await ipcRenderer.invoke('save-settings', settings);
    updateSettings();
  };

  return (
    <SettingsContext.Provider
      value={{
        getSettings,
        updateSettings,
        saveSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
