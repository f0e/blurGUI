import { Input } from '@mui/material';
import BlurControl from '../BlurControl';
import SettingContainer from '../SettingContainer/SettingContainer';

interface BlurTextProps extends BlurControl {}

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
