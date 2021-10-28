import { Input } from '@mui/material';
import { BlurProfileSettings } from '../../../types/BlurProfile';
import SettingContainer from '../SettingContainer/SettingContainer';

interface BlurTextProps {
  settings: BlurProfileSettings;
  changeSetting: (key: string, value: any) => void;
  variable: string;
  label: string;
}

export default function BlurText({
  settings,
  changeSetting,
  variable,
  label,
}: BlurTextProps) {
  const value = (settings as any)[variable];

  return (
    <SettingContainer className="blur-text" margin="1rem">
      <div>{label}</div>

      <Input
        value={value}
        onChange={(e) => changeSetting(variable, e.target.value)}
        size="small"
      />
    </SettingContainer>
  );
}
