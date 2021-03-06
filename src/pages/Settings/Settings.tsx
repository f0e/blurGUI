import { Button } from '@mui/material';
import { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import BlurSelect from '../../components/ProfileEditor/BlurControl/BlurSelect/BlurSelect';
import BlurSlider from '../../components/ProfileEditor/BlurControl/BlurSlider/BlurSlider';
import BlurSwitch from '../../components/ProfileEditor/BlurControl/BlurSwitch/BlurSwitch';
import BlurText from '../../components/ProfileEditor/BlurControl/BlurText/BlurText';
import SettingsContext from '../../context/SettingsContext';
import { EGPUType } from '../../types/Settings';

export default function Settings() {
  const { getSettings, saveSettings } = useContext(SettingsContext);

  const [settings, setSettings] = useState(getSettings());

  const history = useHistory();

  const save = async () => {
    await saveSettings(settings);

    history.goBack();
  };

  const changeSetting = (key: string, value: string) => {
    setSettings((curSettings) => {
      const newSettings: any = { ...curSettings }; // todo: i hate all this 2
      newSettings[key] = value;
      return newSettings;
    });
  };

  return (
    <main className="settings-page">
      <h1>settings</h1>

      <h4>rendering</h4>

      <BlurSlider
        settings={settings}
        changeSetting={changeSetting}
        variable="renderQuality"
        label={'render quality'}
        min={0}
        max={21}
        step={1}
        marks={[
          {
            label: 'lossless',
            value: 0,
          },
          {
            label: 'insane',
            value: 11,
          },
          {
            label: 'great',
            value: 15,
          },
          {
            label: 'good',
            value: 18,
          },
          {
            label: 'regular',
            value: 21,
          },
        ]}
      />

      <BlurSwitch
        settings={settings}
        changeSetting={changeSetting}
        variable="detailedFilenames"
        label={'detailed filenames'}
      />

      <br />

      <h4>advanced rendering</h4>

      <BlurSwitch
        settings={settings}
        changeSetting={changeSetting}
        variable="gpu"
        label={'gpu'}
      />

      <BlurSelect
        settings={settings}
        changeSetting={changeSetting}
        variable="gpuType"
        label={'gpu type'}
        options={EGPUType}
      />

      <BlurText
        settings={settings}
        changeSetting={changeSetting}
        variable="customFFmpegFilters"
        label={'custom ffmpeg filters'}
      />

      <br />

      <div className="links">
        <Button variant="outlined" size="small" onClick={history.goBack}>
          back
        </Button>

        <Button variant="contained" size="small" onClick={save}>
          save
        </Button>
      </div>
    </main>
  );
}
