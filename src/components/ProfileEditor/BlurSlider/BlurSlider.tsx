import { Mark, Slider } from '@mui/material';
import AutosizeInput from 'react-input-autosize';
import { BlurProfileSettings } from '../../../types/BlurProfile';
import SettingContainer from '../SettingContainer/SettingContainer';

import './BlurSlider.scss';

interface SliderProps {
  settings: BlurProfileSettings;
  changeSetting: (key: string, value: any) => void;
  variable: string;
  label: string;
  min: number;
  max: number;
  step: number;
  marks?: Mark[];
  valuePrefix?: string;
}

export default function BlurSlider({
  settings,
  changeSetting,
  variable,
  label,
  min,
  max,
  step,
  marks,
  valuePrefix,
}: SliderProps) {
  const value = (settings as any)[variable];

  return (
    <SettingContainer className="blur-slider" margin="0.5rem">
      <div>
        {label}
        <br />
        {valuePrefix && (
          <span style={{ fontWeight: 'bold' }}>{valuePrefix}</span>
        )}
        <AutosizeInput
          inputClassName="label-value"
          type={Number(value) ? 'number' : 'text'}
          value={value}
          onChange={(e) => changeSetting(variable, e.target.value)}
        />
      </div>

      <Slider
        value={value}
        min={min}
        max={max}
        step={step}
        marks={marks}
        onChange={(_e, value) => changeSetting(variable, value as any)}
      />
    </SettingContainer>
  );
}
