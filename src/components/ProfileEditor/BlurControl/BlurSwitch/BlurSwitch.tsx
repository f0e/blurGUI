import { Switch } from '@mui/material';
import BlurControl from '../BlurControl';
import SettingContainer from '../SettingContainer/SettingContainer';

interface BlurSwitchProps extends BlurControl {}

export default function BlurSwitch({
  settings,
  changeSetting,
  variable,
  label,
}: BlurSwitchProps) {
  const value = (settings as any)[variable];

  return (
    <SettingContainer className="blur-select">
      <div>{label}</div>

      <Switch
        checked={value}
        onChange={(_e, checked) => changeSetting(variable, checked)}
      />
    </SettingContainer>
  );
}
