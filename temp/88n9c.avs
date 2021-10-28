from vapoursynth import core
import vapoursynth as vs
import havsfunc as haf
import adjust
import weighting
import filldrops
video = core.ffms2.Source(source="F:/obs/2021-10/route3.mp4", cache=False)
video = filldrops.FillDrops(video, thresh=0.001)
video = haf.InterFrame(video, GPU=False, NewNum=float(video.fps) * 4, Preset="medium", Tuning="smooth", OverrideAlgo=13)
video = core.std.AssumeFPS(video, fpsnum=(video.fps * 1))
frame_gap = int(video.fps / 24)
blended_frames = int(frame_gap * 0.25)
if blended_frames > 0:
	if blended_frames % 2 == 0:
		blended_frames += 1
	weights = weighting.equal(blended_frames)
	video = core.frameblender.FrameBlend(video, weights, True)
video = haf.ChangeFPS(video, 24)
video.set_output()