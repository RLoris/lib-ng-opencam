export declare enum ECaptureType {
    VIDEO = "video",
    PICTURE = "picture"
}
export declare enum EStreamState {
    PLAY = "play",
    PAUSE = "pause",
    STOP = "stop"
}
export interface ISourceDevice {
    id: string;
    label: string;
    kind: string;
}
export declare enum EMediaConstraints {
    HD = "hd",
    VGA = "vga",
    FHD = "fhd",
    DEFAULT = "default"
}
