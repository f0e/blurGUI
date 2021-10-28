export enum EBlurWeighting {
  equal = 'equal',
  gaussian = 'gaussian',
  gaussian_sym = 'gaussian sym',
  pyramid = 'pyramid',
  pyramid_sym = 'pyramid sym',
  custom_weights = 'custom weights',
  custom_function = 'custom function',
}

export enum EInterpolationProgram {
  svp = 'svp',
  rife = 'rife',
  rifeNCNN = 'rife-ncnn',
}

export class BlurProfileSettings {
  // blur
  blur: boolean = true;
  blurAmount: number = 1;
  blurFps: number = 60;
  blurWeighting: EBlurWeighting = EBlurWeighting.equal;
  deduplicate: boolean = true;

  // interpolation
  interpolate: boolean = true;
  interpolationFactor: number = 3;

  // timescale
  inputTimescale: number = 1;
  outputTimescale: number = 1;
  adjustTimescaledAudioPitch: boolean = false;

  // filters
  brightness: number = 1;
  saturation: number = 1;
  contrast: number = 1;

  // advanced blur
  blurWeightingGaussianStdDev: number = 2;
  blurWeightingTriangleReverse: boolean = false;
  blurWeightingBound: number[] = [0, 2];

  // advanced interpolation
  interpolationProgram: EInterpolationProgram = EInterpolationProgram.svp;
  interpolationSpeed: string = 'default';
  interpolationTuning: string = 'default';
  interpolationAlgorithm: string = 'default';
}

export default class BlurProfile {
  name: string = '';
  creationDate: Date = new Date();

  settings: BlurProfileSettings = new BlurProfileSettings();
}
