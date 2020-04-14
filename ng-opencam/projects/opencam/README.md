# Opencam

Opencam is an Angular library component developped to manipulate camera and perform various actions.

# Demo

Try it out here: [DEMO](https://rloris.github.io/lib-ng-opencam/) or clone this [repo](https://github.com/RLoris/lib-ng-opencam) and run `ng serve` for a full demo of opencam.

# Features

* Stream video (audio support)
* Record video / capture picture
* Countdown
* Framerate
* CSS Filter

# How to use

  First install the package with the command `npm i ng-opencam`

  Then, in your module.ts, import the library module

```
import { OpencamModule } from 'ng-opencam';
```

  And add it to your imports modules.
  You can now use `<ng-opencam></ng-opencam>` it in any component.html

```
<ng-opencam
    [capture]='this.capture$'
    [height]='this.height'
    [width]='this.width'
    [captureType]='this.captureType'
    [streamState]='this.streamState'
    [mediaConstraints]='this.mediaConstraints'
    [videoSource]='this.videoSource'
    [audioSource]='this.audioSource'
    [filters]='this.filter'
    [framerate]='this.framerate'
    (videoSourceEvent)='this.getVideoSources($event)'
    (audioSourceEvent)='this.getAudioSources($event)'
    (captureEvent)='this.getCapture($event)'
    (errorEvent)='this.getErrors($event)'>
</ng-opencam>
```

Check out the repo for a full demo code [here](https://github.com/RLoris/lib-ng-opencam)

## Inputs
| Property | Type | Note |
| -------- | ---- | ---- |
| [capture]| observable(number) | triggers the capture after specific timeout |
| [height] | string | height size of the capture container, if null given capture container is not displayed |
| [width] | string | width size of the capture container, if null given capture container is not displayed |
| [captureType] | enum(ECaptureType) | switch between various capture mode (video, picture) |
| [streamState] | enum(EStreamState) | switch between various stream states (play, pause, stop)| [mediaConstraints] | enum(EMediaConstraints) | switch between various media constraints (hd, vga, fhd, default) | 
[videoSource] | ISourceDevice | Specify the video source for the capture, sources are emitted by (videoSourceEvent) select the one you want to use |
[audioSource] | ISourceDevice | Specify the audio source for the capture, sources are emitted by (audioSourceEvent) select the one you want to use |
[filters] | string | Apply css filters on the feed and capture |
[framerate] | number | Specify the framerate of the recording & canvas rendering |

## Outputs
| Event | Type | Note |
| -------- | ---- | ---- |
| (videoSourceEvent) | array(interface(ISourceDevice)) | Emits the available video source devices for the capture, triggered every time a new video input is detected |
(audioSourceEvent) | array(ISourceDevice(ISourceDevice)) | Emits the available audio source devices for the capture, triggered every time a new audio input is detected |
(captureEvent) | string | Emits the data URL for the media (video, picture) when the capture is triggered (and ended for the video) |
(errorEvent) | Error | Emits all errors |

# To-do

- Improve filter system (add models to manipulate filters instead of css string)
- Move media camera manipulation in a service

# NPM

  This package is on `npm` https://www.npmjs.com/package/ng-opencam

# License

  This package is under the MIT license


