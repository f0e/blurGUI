![blur header](https://github.com/f0e/blurGUI/blob/main/assets/blur-header.png?raw=true)
![screens](https://github.com/f0e/blurGUI/blob/main/assets/screens.png?raw=true)

## about

blurGUI is a program made for easily and efficiently adding motion blur to videos through frame blending.

The amount of motion blur is easily configurable, and there are additional options to enable other features such as interpolating the video's fps. This can be used to generate 'fake' motion blur through frame blending the interpolated footage. This motion blur does not blur non-moving parts of the video, like the HUD in gameplay footage.

This GUI version of the application is still in development, so many features will likely be unstable. For a more consistent experience see https://github.com/f0e/blur for now.

## dev

### dependencies

- [Python](https://www.python.org/downloads)
- [FFmpeg](https://ffmpeg.org/download.html)
- [VapourSynth x64](https://www.vapoursynth.com)

### vapoursynth plugins

- [FFMS2](https://github.com/FFMS/ffms2)
- [HAvsFunc](https://github.com/HomeOfVapourSynthEvolution/havsfunc)
- [SVPflow 4.2.0.142](https://web.archive.org/web/20190322064557/http://www.svp-team.com/files/gpl/svpflow-4.2.0.142.zip)
- [vs-frameblender](https://github.com/f0e/vs-frameblender)
- [weighting.py](https://github.com/f0e/blur/blob/master/plugins/weighting.py)
- [filldrops.py](https://github.com/f0e/blur/blob/master/plugins/filldrops.py)

### building

```
yarn
yarn build
```
