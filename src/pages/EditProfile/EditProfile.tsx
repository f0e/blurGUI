import { useContext, useState } from 'react';
import { Button } from '@mui/material';
import { useRouteMatch, useHistory } from 'react-router-dom';
import ProfileEditor from '../../components/ProfileEditor/ProfileEditor';
import BlurProfile from '../../types/BlurProfile';
import ProfilesContext from '../../context/ProfilesContext';
import MessageContext from '../../context/MessageContext';

export default function EditProfile() {
  const { getProfile, saveProfile, deleteProfile } =
    useContext(ProfilesContext);
  const { setMessage } = useContext(MessageContext);

  const match = useRouteMatch<Record<string, string>>();

  const [originalProfileName] = useState<string>(() => {
    return match.params.profileName;
  });

  const [profile, setProfile] = useState<BlurProfile | null>(() => {
    try {
      return getProfile(originalProfileName);
    } catch (e) {
      setMessage({
        type: 'error',
        message: "couldn't load profile",
      });
      return null;
    }
  });

  const history = useHistory();

  const save = async () => {
    if (!profile) return;

    const promises: Promise<void>[] = [saveProfile(profile)];

    if (profile.name !== originalProfileName) {
      // changed profile name, delete the old profile file
      promises.push(deleteProfile(originalProfileName));
    }

    await Promise.all(promises);

    history.push('/profiles');
  };

  return (
    <main className="edit-profile-page">
      <h1 style={{ wordWrap: 'break-word' }}>
        {profile ? profile.name : originalProfileName}
      </h1>
      {!profile ? (
        <>
          <h4>profile failed to load</h4>

          <br />

          <div className="links">
            <Button variant="outlined" size="small" onClick={history.goBack}>
              back
            </Button>
          </div>
        </>
      ) : (
        <>
          <ProfileEditor
            profile={profile}
            changeName={(newName: string) =>
              setProfile(
                (curProfile) =>
                  ({ ...curProfile, name: newName } as BlurProfile)
              )
            }
            changeProfileSetting={(key: string, value: any) =>
              setProfile((curProfile) => {
                const newProfile: any = { ...curProfile }; // todo: i hate all this
                newProfile.settings[key] = value;
                return newProfile;
              })
            }
          />

          <br />

          <div className="links">
            <Button variant="outlined" size="small" onClick={history.goBack}>
              back
            </Button>

            <Button
              variant="contained"
              size="small"
              disabled={profile.name === ''}
              onClick={save}
            >
              save
            </Button>
          </div>
        </>
      )}
    </main>
  );
}
