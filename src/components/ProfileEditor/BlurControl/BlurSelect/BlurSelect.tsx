import { MenuItem, Select } from '@mui/material';
import BlurControl from '../BlurControl';
import SettingContainer from '../SettingContainer/SettingContainer';

interface BlurSelectProps extends BlurControl {
  options: any;
}

export default function BlurSelect({
  settings,
  changeSetting,
  variable,
  label,
  options,
}: BlurSelectProps) {
  const value = (settings as any)[variable];

  return (
    <SettingContainer className="blur-select" margin="0.3rem">
      <div>{label}</div>

      <Select
        value={value}
        onChange={(e) => changeSetting(variable, e.target.value)}
        size="small"
      >
        {Object.entries(options).map(([optionName, optionAlias]: any) => (
          <MenuItem key={optionName} value={optionName}>
            {optionAlias}
          </MenuItem>
        ))}
      </Select>
    </SettingContainer>
  );
}
