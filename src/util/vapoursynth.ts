
import Render from '../types/Render';
import Settings from '../types/Settings';
import { EInterpolationProgram } from '../types/BlurProfile'
import { slash } from './helpers';

export function generateScript(settings: Settings, render: Render) {
  const filePath = slash((render.file as any).path);

  const video_script = [];

  video_script.push(`from vapoursynth import core`);
  video_script.push(`import vapoursynth as vs`);
  video_script.push(`import havsfunc as haf`);
  video_script.push(`import adjust`);
  video_script.push(`import weighting`);
  if (render.profile.settings.deduplicate)
    video_script.push(`import filldrops`);

  if (render.profile.settings.interpolationProgram === EInterpolationProgram.rife) {
    video_script.push(`from vsrife import RIFE`);
  }

  const extension = render.file.name.split(".").pop();
  if (extension !== "avi") {
    video_script.push(`video = core.ffms2.Source(source="${filePath}", cache=False)`);
  }
  else {
    // FFmpegSource2 doesnt work with frameserver
    video_script.push(`video = core.avisource.AVISource("${filePath}")`);
    video_script.push(`video = core.fmtc.matrix(clip=video, mat="601", col_fam=vs.YUV, bits=16)`);
    video_script.push(`video = core.fmtc.resample(clip=video, css="420")`);
    video_script.push(`video = core.fmtc.bitdepth(clip=video, bits=8)`);
  }

  // replace duplicate frames with new frames which are interpolated based off of the surrounding frames
  if (render.profile.settings.deduplicate)
    video_script.push(`video = filldrops.FillDrops(video, thresh=0.001)`);

  // input timescale
  if (render.profile.settings.inputTimescale !== 1)
    video_script.push(`video = core.std.AssumeFPS(video, fpsnum=(video.fps * (1 / ${render.profile.settings.inputTimescale})))`);

  // interpolation
  if (render.profile.settings.interpolate) {
    if (render.profile.settings.interpolationProgram === EInterpolationProgram.rife) {
      video_script.push(`video = core.resize.Bicubic(video, format=vs.RGBS)`);

      video_script.push(`while video.fps < render.profile.settings.interpolated_fps:`);
      video_script.push(`	video = RIFE(video)`);

      video_script.push(`video = core.resize.Bicubic(video, format=vs.YUV420P8, matrix_s="709")`);
    }
    else if (render.profile.settings.interpolationProgram === EInterpolationProgram.rifeNCNN) {
      video_script.push(`video = core.resize.Bicubic(video, format=vs.RGBS)`);

      video_script.push(`while video.fps < render.profile.settings.interpolated_fps:`);
      video_script.push(`	video = core.rife.RIFE(video)`);

      video_script.push(`video = core.resize.Bicubic(video, format=vs.YUV420P8, matrix_s="709")`);
    }
    else {
      let speed = render.profile.settings.interpolationSpeed;
      if (speed.toLowerCase() === "default") speed = "medium";

      let tuning = render.profile.settings.interpolationTuning;
      if (tuning.toLowerCase() === "default") tuning = "smooth";

      let algorithm = render.profile.settings.interpolationAlgorithm;
      if (algorithm.toLowerCase() === "default") algorithm = "13";

      video_script.push(`video = haf.InterFrame(video, GPU=${settings.gpu ? "True" : "False"}, NewNum=float(video.fps) * ${render.profile.settings.interpolationFactor}, Preset="${speed}", Tuning="${tuning}", OverrideAlgo=${algorithm})`);
    }
  }

  // output timescale
  if (render.profile.settings.outputTimescale)
    video_script.push(`video = core.std.AssumeFPS(video, fpsnum=(video.fps * ${render.profile.settings.outputTimescale}))`);

  // blurring
  if (render.profile.settings.blur) {
    video_script.push(`frame_gap = int(video.fps / ${render.profile.settings.blurFps})`);
    video_script.push(`blended_frames = int(frame_gap * ${render.profile.settings.blurAmount})`);

    video_script.push(`if blended_frames > 0:`);
    
    // number of weights must be odd
    video_script.push(`	if blended_frames % 2 == 0:`);
    video_script.push(`		blended_frames += 1`);
    
    const weightingFunctions = new Map([
      ["equal",			      () => `weighting.equal(blended_frames)`],
      ["gaussian",	  	  () => `weighting.gaussian(blended_frames, ${render.profile.settings.blurWeightingGaussianStdDev}, ${render.profile.settings.blurWeightingBound})`],
      ["gaussian_sym",    () => `weighting.gaussianSym(blended_frames, ${render.profile.settings.blurWeightingGaussianStdDev}, ${render.profile.settings.blurWeightingBound})`],
      ["pyramid",		      () => `weighting.pyramid(blended_frames, ${render.profile.settings.blurWeightingTriangleReverse ? "True" : "False"})`],
      ["pyramid_sym",	    () => `weighting.pyramid(blended_frames)`],
      ["custom_weights",  () => `weighting.divide(blended_frames, ${render.profile.settings.blurWeighting})`],
      ["custom_function", () => `weighting.custom(blended_frames, '${render.profile.settings.blurWeighting}', ${render.profile.settings.blurWeightingBound})`],
    ]);
    
    let weighting: string = render.profile.settings.blurWeighting;
    if (!weightingFunctions.has(weighting)) {
      // check if it's a custom weighting function
      if (weighting.toString().slice(0, 1) === '[' && weighting.toString().slice(-1) === ']')
        weighting = "custom_weights";
      else
        weighting = "custom_function";
    }
    
    const weightingFn = weightingFunctions.get(weighting) as any;
    video_script.push(`	weights = ${weightingFn()}`);
    
    // frame blend
    // video_script.push(`	video = core.misc.AverageFrames(video, [1] * blended_frames)`);
    video_script.push(`	video = core.frameblender.FrameBlend(video, weights, True)`);

    // video_script.push(`if frame_gap > 0:`);
    // video_script.push(`	video = core.std.SelectEvery(video, cycle=frame_gap, offsets=0)`);
    
    // set exact fps
    video_script.push(`video = haf.ChangeFPS(video, ${render.profile.settings.blurFps})`);
  }

  // filters
  if (render.profile.settings.brightness !== 1 || render.profile.settings.contrast !== 1 || render.profile.settings.saturation !== 1)
    video_script.push(`video = adjust.Tweak(video, bright=${render.profile.settings.brightness - 1}, cont=${render.profile.settings.contrast}, sat=${render.profile.settings.saturation})`);

  video_script.push(`video.set_output()`);

  return video_script.join("\n");
}
