import { MenuItem, Select } from '@mui/material';
import { BlurProfileSettings } from '../../../types/BlurProfile';
import SettingContainer from '../SettingContainer/SettingContainer';

interface BlurSelectProps {
  settings: BlurProfileSettings;
  changeSetting: (key: string, value: any) => void;
  variable: string;
  label: string;
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
    <SettingContainer className="blur-select" margin="0.5rem">
      <div>
        {label}
        <br />
        <div style={{ fontWeight: 'bold' }}>{value}</div>
      </div>

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
