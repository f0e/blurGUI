import Render from '../types/Render';
import Settings from '../types/Settings';
import { generateScript } from './vapoursynth';

import moment from 'moment';

const ipcRenderer = window.require('electron').ipcRenderer;
const childProcess = window.require('child_process');
const fs = window.require('fs-extra');
const path = window.require('path');

export function run(
  command: string[],
  onData?: (data: string, err: boolean) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const joinedCommand = command.join(' ');
    console.log(joinedCommand);
    const child = childProcess.exec(joinedCommand);

    let output = '';
    const onDataInner = (data: string, err: boolean) => {
      output += data;
      onData && onData(data, err);
    };

    child.stdout.on('data', (data: string) => onDataInner(data, false));
    child.stderr.on('data', (data: string) => onDataInner(data, true));

    child.on('exit', () => resolve(output));
    child.on('error', () => reject(output));
  });
}

export async function getVideoFormat(filePath: string) {
  const result = await run([
    'ffprobe',
    '-v',
    'quiet',
    '-of',
    'json',
    '-show_format',
    '-i',
    `"${filePath}"`,
    '-hide_banner',
  ]);

  return JSON.parse(result).format;
}

function buildFFmpegScript(
  render: Render,
  settings: Settings,
  videoPath: string,
  outputPath: string
) {
  let ffmpegCommand = ['ffmpeg'];

  // general settings
  ffmpegCommand.push('-loglevel error -hide_banner -stats');

  // input
  ffmpegCommand.push('-i -'); // piped output from video script
  ffmpegCommand.push(`-i "${videoPath}"`); // original video (for audio)
  ffmpegCommand.push('-map 0:v -map 1:a?'); // copy video from first input, copy audio from second

  // audio filters
  let audioFilters = [];

  // timescale (todo: this isn't ideal still, check for a better option)
  if (render.profile.settings.inputTimescale !== 1) {
    // asetrate: speed up and change pitch
    audioFilters.push(
      `asetrate=48000*${1 / render.profile.settings.inputTimescale}`
    );
  }

  if (render.profile.settings.outputTimescale !== 1) {
    if (render.profile.settings.adjustTimescaledAudioPitch) {
      audioFilters.push(`asetrate=48000*${render.profile.settings}`);
    } else {
      // atempo: speed up without changing pitch
      audioFilters.push(`atempo=${render.profile.settings.outputTimescale}`);
    }
  }

  if (audioFilters.length > 0)
    ffmpegCommand.push('-af ' + audioFilters.join(','));

  if (settings.customFFmpegFilters !== '') {
    ffmpegCommand.push('' + settings.customFFmpegFilters);
  } else {
    // video format
    if (settings.gpu) {
      if (settings.gpuType === 'nvidia')
        ffmpegCommand.push(
          `-c:v h264_nvenc -preset p7 -qp ${settings.renderQuality}`
        );
      else if (settings.gpuType === 'amd')
        ffmpegCommand.push(
          `-c:v h264_amf -qp_i ${settings.renderQuality} -qp_b ${settings.renderQuality} -qp_p ${settings.renderQuality} -quality quality`
        );
      else if (settings.gpuType === 'intel')
        ffmpegCommand.push(
          `-c:v h264_qsv -global_quality ${settings.renderQuality} -preset veryslow`
        );
    } else {
      ffmpegCommand.push(
        `-c:v libx264 -pix_fmt yuv420p -preset superfast -crf ${settings.renderQuality}`
      );
    }

    // audio format
    ffmpegCommand.push('-c:a aac -b:a 320k');

    // extra
    ffmpegCommand.push('-movflags +faststart');
  }

  // output
  ffmpegCommand.push(`"${outputPath}"`);

  // // extra output for preview. generate low-quality preview images.
  // if (true) {
  //   ffmpegCommand.push('-map 0:v'); // copy video from first input
  //   ffmpegCommand.push(
  //     `-q:v 3 -update 1 -atomic_writing 1 -y "${preview_filename}"`
  //   );
  // }

  return ffmpegCommand;
}

export async function runBlur(
  settings: Settings,
  render: Render,
  onProgress: (progress: number) => void
) {
  // set up paths
  const videoPath = (render.file as any).path;
  const videoFolder = path.resolve(videoPath, `../`);
  const videoName = render.file.name.split('.')[0];

  // build output filename
  let num = 1,
    outputPath;
  do {
    outputPath = `${videoFolder}/${videoName} - blur`;

    if (num > 1) outputPath += ` (${num})`;
    outputPath += '.mp4';

    num++;
  } while (fs.existsSync(outputPath));

  // create vapoursynth script
  const vapoursynthScript = generateScript(settings, render);
  const scriptFilename = `${(Math.random() + 1).toString(36).substring(7)}.avs`;
  const scriptPath = await ipcRenderer.invoke(
    'save-script',
    scriptFilename,
    vapoursynthScript
  );

  // build commands
  const vapoursynthCommand = ['vspipe', scriptPath, '-y', '-'];
  const ffmpegCommand = buildFFmpegScript(
    render,
    settings,
    videoPath,
    outputPath
  );

  const command = [...vapoursynthCommand, '|', ...ffmpegCommand];

  // get video duration
  const videoFormat = await getVideoFormat((render.file as any).path);

  let duration = videoFormat.duration;
  if (render.profile.settings.inputTimescale !== 1)
    duration *= render.profile.settings.inputTimescale; // todo: test if this is accurate

  onProgress(0);

  const onData = (line: string, err: boolean) => {
    const getElapsed = () => {
      let match = line.match(
        /frame=\s*[^\s]+\s+fps=\s*[^\s]+\s+q=\s*[^\s]+\s+(?:size|Lsize)=\s*[^\s]+\s+time=\s*([^\s]+)\s+/
      );

      // Audio only looks like this: "line size=  233422kB time=01:45:50.68 bitrate= 301.1kbits/s speed= 353x    "
      if (!match)
        match = line.match(/(?:size|Lsize)=\s*[^\s]+\s+time=\s*([^\s]+)\s+/);

      if (!match) return null;

      const timecode = match[1];
      return Math.max(0, moment.duration(timecode).asSeconds());
    };

    const elapsedSecs = getElapsed();
    if (elapsedSecs != null) {
      const elapsedPercent = elapsedSecs / duration;

      onProgress(elapsedPercent);

      console.log('Render progress:', elapsedPercent);
    }

    if (err) console.log(line);
  };

  const result = await run(command, onData);

  await ipcRenderer.invoke('delete-script', scriptFilename);

  return result;
}
