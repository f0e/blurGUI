export enum EGPUType {
  nvidia = 'nvidia',
  amd = 'amd',
  intel = 'intel',
}

export default class Settings {
  detailedFilenames: boolean = false;

  renderQuality: number = 12;

  gpu: boolean = false;
  gpuType: EGPUType = EGPUType.nvidia;

  customFFmpegFilters: string = '';
}
