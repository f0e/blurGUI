import { useContext, useState } from 'react';
import { useHistory } from 'react-router';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Input,
  Tab,
  Tabs,
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import BlurProfile, {
  BlurProfileSettings,
  EBlurWeighting,
  EInterpolationProgram,
} from '../../types/BlurProfile';
import BlurSlider from './BlurControl/BlurSlider/BlurSlider';
import BlurSelect from './BlurControl/BlurSelect/BlurSelect';
import BlurSwitch from './BlurControl/BlurSwitch/BlurSwitch';
import BlurText from './BlurControl/BlurText/BlurText';
import ProfilesContext from '../../context/ProfilesContext';

import './ProfileEditor.scss';

interface SettingsPageProps {
  settings: BlurProfileSettings;
  changeSetting: (key: string, value: any) => void;
}

function BlurSettings({ settings, changeSetting }: SettingsPageProps) {
  return (
    <>
      <h4>motion blur</h4>

      <BlurSwitch
        settings={settings}
        changeSetting={changeSetting}
        variable="blur"
        label={'blur'}
      />

      {settings.blur && (
        <>
          <BlurSlider
            settings={settings}
            changeSetting={changeSetting}
            variable="blurAmount"
            label={'blur amount'}
            min={0.01}
            max={2}
            step={0.01}
            marks={[
              {
                label: 'light',
                value: 0.2,
              },
              {
                label: 'regular',
                value: 0.5,
              },
              {
                label: 'full',
                value: 1,
              },
              {
                label: 'extreme',
                value: 1.5,
              },
              {
                label: 'insane',
                value: 2,
              },
            ]}
          />

          <BlurSlider
            settings={settings}
            changeSetting={changeSetting}
            variable="blurFps"
            label={'blur fps'}
            min={2}
            max={120}
            step={1}
          />

          <BlurSelect
            settings={settings}
            changeSetting={changeSetting}
            variable="blurWeighting"
            label={'blur weighting'}
            options={EBlurWeighting}
          />

          {settings.blurWeighting !== 'equal' && (
            <>
              <br />

              <h4>advanced blur</h4>

              {['gaussian', 'gaussian_sym'].includes(
                settings.blurWeighting
              ) && (
                <BlurSlider
                  settings={settings}
                  changeSetting={changeSetting}
                  variable="blurWeightingGaussianStdDev"
                  label={'weighting gaussian std dev'}
                  min={1}
                  max={50}
                  step={1}
                />
              )}

              {['pyramid', 'pyramid_sym'].includes(settings.blurWeighting) && (
                <BlurSwitch
                  settings={settings}
                  changeSetting={changeSetting}
                  variable="blurWeightingTriangleReverse"
                  label={'weighting gaussian reverse triangle'}
                />
              )}

              {['custom_weights', 'custom_function'].includes(
                settings.blurWeighting
              ) && <div style={{ textAlign: 'center' }}>TODO</div>}

              {['gaussian', 'gaussian_sym', 'custom_function'].includes(
                settings.blurWeighting
              ) && (
                <BlurSlider
                  settings={settings}
                  changeSetting={changeSetting}
                  variable="blurWeightingBound"
                  label={'weighting bound'}
                  min={0}
                  max={10}
                  step={0.1}
                />
              )}
            </>
          )}
        </>
      )}
    </>
  );
}

function InterpolationSettings({ settings, changeSetting }: SettingsPageProps) {
  return (
    <>
      <h4>interpolation</h4>

      <BlurSwitch
        settings={settings}
        changeSetting={changeSetting}
        variable="interpolate"
        label={'interpolate'}
      />

      {settings.interpolate && (
        <>
          <BlurSlider
            settings={settings}
            changeSetting={changeSetting}
            variable="interpolationFactor"
            label={'interpolation factor'}
            min={2}
            max={10}
            step={1}
            valuePrefix="x"
          />

          <br />

          <h4>advanced interpolation</h4>

          <BlurSelect
            settings={settings}
            changeSetting={changeSetting}
            variable="interpolationProgram"
            label={'interpolation program'}
            options={EInterpolationProgram}
          />

          {settings.interpolationProgram === 'svp' && (
            <>
              <BlurText
                settings={settings}
                changeSetting={changeSetting}
                variable="interpolationSpeed"
                label={'interpolation speed'}
              />

              <BlurText
                settings={settings}
                changeSetting={changeSetting}
                variable="interpolationTuning"
                label={'interpolation tuning'}
              />

              <BlurText
                settings={settings}
                changeSetting={changeSetting}
                variable="interpolationAlgorithm"
                label={'interpolation algorithm'}
              />
            </>
          )}
        </>
      )}
    </>
  );
}

function ExtraSettings({ settings, changeSetting }: SettingsPageProps) {
  return (
    <>
      <h4>extra</h4>

      <BlurSwitch
        settings={settings}
        changeSetting={changeSetting}
        variable="deduplicate"
        label={'remove duplicate frames'}
      />

      <br />

      <h4>filters</h4>

      <BlurSlider
        settings={settings}
        changeSetting={changeSetting}
        variable="brightness"
        label={'brightness'}
        min={0}
        max={20}
        step={0.1}
      />

      <BlurSlider
        settings={settings}
        changeSetting={changeSetting}
        variable="saturation"
        label={'saturation'}
        min={0}
        max={3}
        step={0.1}
      />

      <BlurSlider
        settings={settings}
        changeSetting={changeSetting}
        variable="contrast"
        label={'contrast'}
        min={0}
        max={20}
        step={0.1}
      />

      <br />

      <h4>timescale</h4>

      <BlurSlider
        settings={settings}
        changeSetting={changeSetting}
        variable="inputTimescale"
        label={'input timescale'}
        min={0}
        max={2}
        step={0.01}
      />

      <BlurSlider
        settings={settings}
        changeSetting={changeSetting}
        variable="outputTimescale"
        label={'output timescale'}
        min={0}
        max={2}
        step={0.01}
      />
    </>
  );
}

function TabPanel({ children, value, index, ...other }: any) {
  return (
    <>
      {value === index && (
        <motion.div
          className="setting-page"
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          role="tabpanel"
          {...other}
        >
          {children}
        </motion.div>
      )}
    </>
  );
}

function SettingTab(props: any) {
  return (
    <Tab
      key={props.label}
      sx={{ fontWeight: props.settingEnabled ? 'bold' : null }}
      {...props}
    />
  );
}

interface ProfileEditorProps {
  profile: BlurProfile;
  changeName: (newName: string) => void;
  changeProfileSetting: (key: string, value: any) => void;
}

export default function ProfileEditor({
  profile,
  changeName,
  changeProfileSetting,
}: ProfileEditorProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [page, setPage] = useState(0);

  const { deleteProfile } = useContext(ProfilesContext);
  const history = useHistory();

  const changePage = (e: any, newPage: number) => {
    setPage(newPage);
  };

  const openDelete = () => setDeleteOpen(true);
  const closeDelete = async (deleting: boolean) => {
    setDeleteOpen(false);

    if (deleting) {
      await deleteProfile(profile.name);
      history.push('/profiles');
    }
  };

  return (
    <div className="profile-editor">
      <div className="profile-management">
        <div>
          <h4>name</h4>
          <Input
            placeholder="profile name"
            value={profile.name}
            onChange={(e) => changeName(e.target.value)}
          />
        </div>
        <div>
          <Button variant="outlined" onClick={openDelete} size="small">
            delete
          </Button>

          <Dialog open={deleteOpen} onClose={() => closeDelete(false)}>
            <DialogTitle sx={{ fontFamily: 'Monument Extended' }}>
              delete profile?
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                are you sure you want to delete the profile '{profile.name}'?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => closeDelete(true)}>yes</Button>
              <Button onClick={() => closeDelete(false)} autoFocus>
                no
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>

      <br />

      <Tabs
        value={page}
        onChange={changePage}
        variant="scrollable"
        scrollButtons={true}
        allowScrollButtonsMobile
      >
        <SettingTab
          label="motion blur"
          settingEnabled={profile.settings.blur}
        />
        <SettingTab
          label="interpolation"
          settingEnabled={profile.settings.interpolate}
        />
        <SettingTab label="extra" />
      </Tabs>

      <br />

      <AnimatePresence initial={false}>
        <TabPanel key={0} index={0} value={page}>
          <BlurSettings
            settings={profile.settings}
            changeSetting={changeProfileSetting}
          />
        </TabPanel>
        <TabPanel key={1} value={page} index={1}>
          <InterpolationSettings
            settings={profile.settings}
            changeSetting={changeProfileSetting}
          />
        </TabPanel>
        <TabPanel key={2} value={page} index={2}>
          <ExtraSettings
            settings={profile.settings}
            changeSetting={changeProfileSetting}
          />
        </TabPanel>
      </AnimatePresence>
    </div>
  );
}
