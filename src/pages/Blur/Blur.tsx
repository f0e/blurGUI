import {
  ArrowLeft,
  ArrowRight,
  Pause,
  PlayArrow,
  VolumeMute,
  VolumeUp,
} from '@mui/icons-material';
import { Button, Slider } from '@mui/material';
import { useEffect, useState, useContext, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';
import ProfileDisplay from '../../components/ProfileDisplay/ProfileDisplay';
import ProfileSelector from '../../components/ProfileSelector/ProfileSelector';
import FilesContext from '../../context/FilesContext';
import ProfilesContext from '../../context/ProfilesContext';
import RenderContext from '../../context/RenderContext';

import './Blur.scss';

interface VideoPreviewProps {
  file: File;
  fileToLeft: File;
  fileToRight: File;
  changeFile: (side: 'left' | 'right') => void;
}

function VideoPreview({
  file,
  fileToLeft,
  fileToRight,
  changeFile,
}: VideoPreviewProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [paused, setPaused] = useState(true);
  const [played, setPlayed] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setObjectUrl((curUrl) => {
      if (curUrl) URL.revokeObjectURL(curUrl);
      if (file) return URL.createObjectURL(file);

      return null;
    });

    setPaused(true);
    setPlayed(0);
  }, [file]);

  const playPause = () => {
    if (!videoRef.current) return;

    const newPaused = !videoRef.current.paused;
    newPaused ? videoRef.current.pause() : videoRef.current.play();
    setPaused(newPaused);
  };

  const muteUnmute = () => {
    if (!videoRef.current) return;

    const newMuted = !videoRef.current.muted;
    videoRef.current.muted = newMuted;
    setMuted(newMuted);
  };

  const seek = (newSeekVal: number) => {
    if (!videoRef.current) return;

    const seekPercent = newSeekVal / 100;
    setPlayed(seekPercent);
    videoRef.current.currentTime = seekPercent * videoRef.current.duration;
  };

  const changeVolume = (newVolume: number) => {
    if (!videoRef.current) return;

    const volumePercent = newVolume / 100;
    setVolume(volumePercent);
    videoRef.current.volume = volumePercent;
  };

  return (
    <div className="video-player">
      <div className="video-and-nav">
        <ChangeFileButton
          nextFile={fileToLeft}
          direction="left"
          onClick={() => changeFile('left')}
        />

        {!objectUrl ? (
          <Loader message="loading video" />
        ) : (
          <video
            ref={videoRef}
            onProgress={(e) => console.log(e)}
            className="video"
            src={objectUrl}
          />
        )}

        <ChangeFileButton
          nextFile={fileToRight}
          direction="right"
          onClick={() => changeFile('right')}
        />
      </div>

      <div className="video-controls">
        <div className="control-row">
          <Slider
            min={0}
            max={100}
            value={played * 100}
            onChange={(e, value) => seek(value as any)}
          />
        </div>

        <div className="control-row">
          <div className="control" onClick={playPause}>
            {paused ? <PlayArrow /> : <Pause />}
          </div>

          <div className="control" onClick={muteUnmute}>
            {muted ? <VolumeMute /> : <VolumeUp />}
          </div>

          <Slider
            min={0}
            max={100}
            value={volume * 100}
            onChange={(e, value) => changeVolume(value as any)}
            sx={{ width: '7rem' }}
          />
        </div>
      </div>
    </div>
  );
}

interface ChangeFileButtonProps {
  nextFile: File;
  direction: 'left' | 'right';
  onClick: () => void;
}

function ChangeFileButton({
  nextFile,
  direction,
  onClick,
}: ChangeFileButtonProps) {
  return (
    <div
      className={`change-file-button${!nextFile ? ' disabled' : ''}`}
      onClick={() => nextFile && onClick()}
    >
      {direction === 'left' ? <ArrowLeft /> : <ArrowRight />}
    </div>
  );
}

export default function Blur() {
  const { getFiles, clearFiles } = useContext(FilesContext);
  const { getAllProfiles } = useContext(ProfilesContext);
  const { queueRender } = useContext(RenderContext);

  const files = getFiles();
  const profiles = getAllProfiles();

  const [fileIndex, setFileIndex] = useState(0);
  const [selectedProfileName, setSelectedProfileName] = useState<string | null>(
    profiles.length === 0 ? null : profiles[0].name
  );

  const history = useHistory();

  if (files.length === 0) history.push('/');

  const selectedFile = files[fileIndex];
  const selectedProfile = profiles.find(
    (profile) => profile.name === selectedProfileName
  );

  const fileToLeft = files[fileIndex - 1];
  const fileToRight = files[fileIndex + 1];

  if (!selectedFile) {
    setFileIndex((curIndex) => curIndex - 1); // if the file doesn't exist somehow, just go back one
    return <></>;
  }

  const render = () => {
    if (!selectedProfile) return;

    for (const file of files) {
      queueRender(file, selectedProfile);
    }

    clearFiles();

    history.push(`/blur/render`);
  };

  return (
    <main className="blur-page">
      <h2>
        video {fileIndex + 1}/{files.length}
      </h2>

      <h4>{selectedFile.name}</h4>
      <VideoPreview
        file={selectedFile}
        fileToLeft={fileToLeft}
        fileToRight={fileToRight}
        changeFile={(side) =>
          side === 'left'
            ? setFileIndex((curIndex) => curIndex - 1)
            : setFileIndex((curIndex) => curIndex + 1)
        }
      />

      <br />

      {!selectedProfileName && (
        <>
          <h4 style={{ marginBottom: '0.5rem' }}>no profiles found</h4>
          <Link to="/profiles/create">
            <Button variant="outlined" size="small">
              create new
            </Button>
          </Link>
          <br />
        </>
      )}

      {selectedProfileName && selectedProfile && (
        <>
          <ProfileSelector
            profiles={profiles}
            selectedProfile={selectedProfileName}
            setSelectedProfile={(newProfileName: string) =>
              setSelectedProfileName(newProfileName)
            }
          />

          <div style={{ height: '0.5rem' }} />

          <ProfileDisplay profile={selectedProfile} />
        </>
      )}

      <br />

      <div className="links">
        <Button
          variant="contained"
          size="small"
          onClick={render}
          disabled={!selectedProfile}
        >
          render
        </Button>
      </div>
    </main>
  );
}
