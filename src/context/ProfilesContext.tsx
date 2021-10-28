import { createContext, FunctionComponent, useEffect, useState } from 'react';
import BlurProfile, { BlurProfileSettings } from '../types/BlurProfile';

const ipcRenderer = window.require('electron').ipcRenderer;

const getProfiles = async () => {
  const profiles: string[] = await ipcRenderer.invoke('get-profiles');
  return profiles;
};

const readProfile = async (name: string) => {
  const profileJSON = await ipcRenderer.invoke('read-profile', name);

  // todo: clean this up
  const profileSettings = profileJSON.settings;
  delete profileJSON.settings;

  let profile = Object.assign(new BlurProfile(), profileJSON);
  profile.settings = Object.assign(new BlurProfileSettings(), profileSettings);

  return profile;
};

const readAllProfiles = async () => {
  const profileNames = await getProfiles();

  const profiles = await Promise.all(
    profileNames.map(
      async (profileName: string) => await readProfile(profileName)
    )
  );

  return profiles;
};

export interface IProfilesContext {
  updateProfiles: () => Promise<void>;

  getProfile: (name: string) => BlurProfile;
  getAllProfiles: () => BlurProfile[];

  saveProfile: (profile: BlurProfile) => Promise<void>;
  deleteProfile: (name: string) => Promise<void>;

  profileNameExists: (name: string) => boolean;
}

const ProfilesContext = createContext({} as IProfilesContext);

export const ProfilesStore: FunctionComponent = ({ children }) => {
  const [profiles, setProfiles] = useState<BlurProfile[]>([]);

  // load profiles on startup
  useEffect(() => {
    updateProfiles();
  }, []);

  const updateProfiles = async () => {
    const newProfiles = await readAllProfiles();
    setProfiles(newProfiles);
  };

  const getAllProfiles = () => profiles;

  const getProfile = (name: string) => {
    const profile = profiles.find((profile) => profile.name === name);
    if (!profile) throw new Error('profile not found');
    return profile;
  };

  const saveProfile = async (profile: BlurProfile) => {
    await ipcRenderer.invoke('save-profile', profile);
    updateProfiles();
  };

  const deleteProfile = async (name: string) => {
    await ipcRenderer.invoke('delete-profile', name);
    updateProfiles();
  };

  const profileNameExists = (name: string) => {
    try {
      getProfile(name);
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <ProfilesContext.Provider
      value={{
        updateProfiles,
        getProfile,
        getAllProfiles,
        saveProfile,
        deleteProfile,
        profileNameExists,
      }}
    >
      {children}
    </ProfilesContext.Provider>
  );
};

export default ProfilesContext;
