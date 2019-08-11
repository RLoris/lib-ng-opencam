
export enum ECaptureType {
  VIDEO = 'video',
  PICTURE = 'picture'
}

export enum EStreamState {
  PLAY = 'play',
  PAUSE = 'pause',
  STOP = 'stop'
}

export interface ISourceDevice {
  id: string;
  label: string;
  kind: string;
}

export enum EMediaConstraints {
  HD = 'hd',
  VGA = 'vga',
  FHD = 'fhd',
  DEFAULT = 'default'
}

/*
export enum EFilter {
  BLUR = 'blur',
  BRIGHTNESS = 'brightness',
  CONTRAST = 'contrast',
  DROP_SHADOW = 'drop-shadow',
  GRAYSCALE = 'grayscale',
  HUE_ROTATE = 'hue-rotate',
  INVERT = 'invert',
  OPACITY = 'opacity',
  SATURATE = 'saturate',
  SEPIA = 'sepia',
  NONE = 'none'
}
*/

