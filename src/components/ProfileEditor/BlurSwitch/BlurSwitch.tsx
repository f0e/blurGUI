import { Switch } from '@mui/material';
import { BlurProfileSettings } from '../../../types/BlurProfile';
import SettingContainer from '../SettingContainer/SettingContainer';

interface BlurSwitchProps {
  settings: BlurProfileSettings;
  changeSetting: (key: string, value: any) => void;
  variable: string;
  label: string;
}

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
