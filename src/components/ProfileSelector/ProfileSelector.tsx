import { Link } from 'react-router-dom';
import { Select, MenuItem, Button } from '@mui/material';
import BlurProfile from '../../types/BlurProfile';

import './ProfileSelector.scss';

interface ProfileSelectorProps {
  profiles: BlurProfile[];
  selectedProfile: string;
  setSelectedProfile: (profile: string) => void;
}

export default function ProfileSelector({
  profiles,
  selectedProfile,
  setSelectedProfile,
}: ProfileSelectorProps) {
  return (
    <div className="profile-selector">
      <h4>profile</h4>

      <div className="controls">
        <Select
          size="small"
          value={selectedProfile}
          onChange={(e) => setSelectedProfile(e.target.value)}
        >
          {profiles.map((profile: BlurProfile) => {
            return (
              <MenuItem key={profile.name} value={profile.name}>
                {profile.name}
              </MenuItem>
            );
          })}
        </Select>

        <Link
          to={`/profiles/${selectedProfile}/edit`}
          style={{ height: '100%' }}
        >
          <Button variant="outlined" size="small" sx={{ height: '100%' }}>
            edit
          </Button>
        </Link>
      </div>
    </div>
  );
}
