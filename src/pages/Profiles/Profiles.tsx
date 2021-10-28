import { Card, CardContent, Button } from '@mui/material';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import ProfileDisplay from '../../components/ProfileDisplay/ProfileDisplay';
import ProfilesContext from '../../context/ProfilesContext';
import BlurProfile from '../../types/BlurProfile';

import './Profiles.scss';

export default function EditProfile() {
  const { getAllProfiles } = useContext(ProfilesContext);

  const profiles = getAllProfiles();

  return (
    <main className="profiles-page">
      <h1>profiles</h1>

      <div id="profiles">
        {profiles.length === 0 ? (
          <h4>no profiles found</h4>
        ) : (
          profiles.map((profile: BlurProfile) => {
            return (
              <Link key={profile.name} to={`/profiles/${profile.name}/edit`}>
                <div className="profile-card">
                  <Card variant="outlined">
                    <CardContent>
                      <h4 style={{ marginBottom: '0.3rem' }}>{profile.name}</h4>
                      {profile ? (
                        <ProfileDisplay profile={profile} />
                      ) : (
                        <div>loading</div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </Link>
            );
          })
        )}
      </div>

      <br />

      <div className="links">
        <Link to="/">
          <Button variant="outlined" size="small">
            back
          </Button>
        </Link>

        <Link to="/profiles/create">
          <Button variant="contained" size="small">
            create new profile
          </Button>
        </Link>
      </div>
    </main>
  );
}
