import { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@mui/material';
import BlurProfile from '../../types/BlurProfile';
import ProfileEditor from '../../components/ProfileEditor/ProfileEditor';
import ProfilesContext from '../../context/ProfilesContext';
import MessageContext from '../../context/MessageContext';

export default function CreateProfile() {
  const { profileNameExists, saveProfile } = useContext(ProfilesContext);

  const [profile, setProfile] = useState(new BlurProfile());

  const history = useHistory();
  const { setMessage } = useContext(MessageContext);

  const create = async () => {
    if (profileNameExists(profile.name)) {
      setMessage({
        type: 'error',
        message: 'a profile already exists with that name',
      });
      return;
    }

    await saveProfile(profile);

    history.goBack();
  };

  return (
    <main className="create-profile-page">
      <h1 style={{ wordWrap: 'break-word' }}>
        {profile.name || 'new profile'}
      </h1>

      <ProfileEditor
        profile={profile}
        changeName={(newName: string) =>
          setProfile(
            (curProfile) => ({ ...curProfile, name: newName } as BlurProfile)
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
          onClick={create}
        >
          create
        </Button>
      </div>
    </main>
  );
}
