import BlurProfile from '../../types/BlurProfile';

interface ProfileDisplayProps {
  profile: BlurProfile;
}

export default function ProfileDisplay({ profile }: ProfileDisplayProps) {
  return (
    <div>
      {profile.settings.interpolate ? (
        <div>interpolation factor: {profile.settings.interpolationFactor}</div>
      ) : (
        <div>no interpolation</div>
      )}

      {profile.settings.blur ? (
        <div>blur amount: {profile.settings.blurAmount}</div>
      ) : (
        <div>no blur</div>
      )}
    </div>
  );
}
