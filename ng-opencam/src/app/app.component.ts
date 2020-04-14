import { Component, OnInit, SecurityContext } from '@angular/core';
import { Subject } from 'rxjs';
import { ECaptureType, EStreamState, EMediaConstraints, ISourceDevice } from 'projects/opencam/src/public-api';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'ng-opencam';
  capture$: Subject<number>;
  height: string;
  width: string;
  captureType: ECaptureType;
  streamStates: EStreamState[];
  streamState: EStreamState;
  mediaConstraints: EMediaConstraints[];
  mediaConstraint: EMediaConstraints;
  videoSources: ISourceDevice[];
  videoSource: ISourceDevice;
  audioSources: ISourceDevice[];
  audioSource: ISourceDevice;
  filter: string;
  filters: string[];
  framerate: number;
  framerates: number[];
  countDown: number;
  images: SafeHtml[];
  videos: SafeHtml[];
  isCapturing: boolean;

  constructor(private domSanitizer: DomSanitizer) {
    this.isCapturing = false;
    this.images = [];
    this.videos = [];
    // size
    this.height = '60vh';
    this.width = '80vw';
    // observable for capture
    this.capture$ = new Subject<number>();
    // device
    this.videoSources = [];
    this.audioSources = [];
    // filter
    this.filters = [
      'blur(5px)',
      'brightness(0.4)',
      'contrast(200%)',
      'drop-shadow(16px 16px 20px blue)',
      'grayscale(50%)',
      'hue-rotate(90deg)',
      'invert(75%)',
      'opacity(25%)',
      'saturate(30%)',
      'sepia(60%)',
      'none'
    ];
    this.filter = 'none';
    // framerate
    this.framerates = [
      15,
      25,
      30,
      48,
      60
    ];
    this.framerate = 15;
    // default mode
    this.captureType = ECaptureType.PICTURE;
    // default stream mode
    this.streamStates = [
      EStreamState.PLAY,
      EStreamState.PAUSE,
      EStreamState.STOP
    ];
    this.streamState = EStreamState.PLAY;
    // default media constraints
    this.mediaConstraints = [
      EMediaConstraints.DEFAULT,
      EMediaConstraints.FHD,
      EMediaConstraints.HD,
      EMediaConstraints.VGA
    ];
    this.mediaConstraint = EMediaConstraints.DEFAULT;
    this.countDown = 0;
  }

  ngOnInit(): void {

  }

  switchMode() {
    if (this.captureType === ECaptureType.PICTURE) {
      this.captureType = ECaptureType.VIDEO;
    } else {
      this.captureType = ECaptureType.PICTURE;
    }
  }

  getVideoSources(devices) {
    this.videoSources = devices;
  }

  getAudioSources(devices) {
    this.audioSources = devices;
  }

  getCapture(capture) {
    this.isCapturing = false;
    if (this.captureType === ECaptureType.PICTURE) {
      this.images.push(this.domSanitizer.sanitize(SecurityContext.URL,capture));
    } else {
      this.videos.push(this.domSanitizer.bypassSecurityTrustUrl(capture));
    }
  }

  capture() {
    if (this.streamState !== EStreamState.STOP) {
      this.isCapturing = true;
    }
    this.capture$.next(this.countDown);
  }

  getErrors(error) {
    this.isCapturing = false;
    console.log('OpenCam Error: ' + error);
  }

  getBgColor() {
    if (this.captureType === ECaptureType.VIDEO && this.isCapturing) {
      return 'red';
    } else if (this.captureType === ECaptureType.VIDEO) {
      return 'green';
    } else {
      return 'white';
    }
  }

  selectVideoSource(id) {
    this.videoSource = this.videoSources.find(d => d.id === id);
  }

  selectAudioSource(id) {
    this.audioSource = this.audioSources.find(d => d.id === id);
  }

}
