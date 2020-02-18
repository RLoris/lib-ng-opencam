import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { ISourceDevice, ECaptureType, EStreamState, EMediaConstraints } from './opencam.models';
import { Observable } from 'rxjs';

@Component({
  selector: 'ng-opencam',
  templateUrl: './opencam.component.html',
  styles: []
})
export class OpencamComponent implements OnInit, OnDestroy {

  @Output()
  captureEvent: EventEmitter<any> = new EventEmitter(true);
  @Output()
  videoSourceEvent: EventEmitter<ISourceDevice[]> = new EventEmitter(true);
  @Output()
  audioSourceEvent: EventEmitter<ISourceDevice[]> = new EventEmitter(true);
  @Output()
  errorEvent: EventEmitter<Error> = new EventEmitter(true);

  @Input()
  set framerate(v: number) {
    if (v > 0 && v <= 60) {
      this._framerate = Math.abs(v);
    }
  }
  // tslint:disable-next-line:variable-name
  private _framerate = 30;

  @Input()
  set videoSource(v: ISourceDevice) {
    if (this.isScanCompleted) {
      this._videoSource = this.videoSources.find(d => d.id == v.id);
      if (this._videoSource) {
        this.stopStream();
        this.initStream();
      }
    }
  }
  // tslint:disable-next-line:variable-name
  private _videoSource: ISourceDevice;
  @Input()
  set audioSource(v: ISourceDevice) {
    if (this.isScanCompleted) {
      this._audioSource = this.audioSources.find(d => d.id == v.id);
      if(this._audioSource)  {
        this.stopStream();
        this.initStream();
      }
    }
  }
  // tslint:disable-next-line:variable-name
  private _audioSource: ISourceDevice = null;
  display: string;
  @Input()
  set width(v: string) {
    if (v !== null) {
      this._width = v;
    } else {
      this.display = 'none';
    }
  }
  // tslint:disable-next-line:variable-name
  _width: string;
  @Input()
  set height(v: string) {
    if (v !== null) {
      this._height = v;
    } else {
      this.display = 'none';
    }
  }
  // tslint:disable-next-line:variable-name
  _height: string;
  @Input()
  set capture(v: Observable<number>) {
    v.subscribe(
      (c) => {
        setTimeout(() => {
          if (this.stream) {
            if (this._captureType === ECaptureType.VIDEO) {
              if (!this.isRecording) {
                this.startRecording();
              } else {
                this.stopRecording();
              }
            } else {
              const img = this.captureStreamShot();
              if (img) { this.captureHandler(img); }
            }
          }
        }, 1000 * Math.abs(c));
      }
    );
  }
  // tslint:disable-next-line:variable-name
  private _capture: Observable<number>;
  @Input()
  set captureType(v: ECaptureType) {
    this._captureType = v;
  }
  // tslint:disable-next-line:variable-name
  private _captureType: ECaptureType;
  @Input()
  set streamState(v: EStreamState) {
    if (v) {
      this._streamState = v;
      if (this.stream !== undefined && this.stream !== null) {
        if (v === EStreamState.PLAY) {
          this.video.play();
          if (this.recorder) {
            this.recorder.resume();
          }
        } else if (v === EStreamState.PAUSE) {
          this.video.pause();
          if (this.recorder) {
            this.recorder.pause();
          }
        } else if (v === EStreamState.STOP) {
          this.video.pause();
          if (this.recorder) {
            this.recorder.stop();
          }
          this.stopStream();
          this.video.srcObject = null;
        }
      } else {
        if (v === EStreamState.PLAY && this.videoSources.length > 0) {
          this.initStream();
        }
      }
    }
  }
  // tslint:disable-next-line:variable-name
  private _streamState: EStreamState;
  @Input()
  set mediaConstraints(v: EMediaConstraints) {
    if (v) {
      this._mediaConstraints = v;
      if (v === EMediaConstraints.HD) {
        this.constraints.video.width = {min: 1280};
        this.constraints.video.height = {min: 720};
      } else if (v === EMediaConstraints.FHD) {
        this.constraints.video.width = {min: 1920};
        this.constraints.video.height = {min: 1080};
      } else if (v === EMediaConstraints.VGA) {
        this.constraints.video.width = {min: 640};
        this.constraints.video.height = {min: 480};
      } else {
        if (this.constraints && this.constraints.video) {
          if (this.constraints.video.width) {
            delete this.constraints.video.width;
          }
          if (this.constraints.video.height) {
            delete this.constraints.video.height;
          }
        }

      }
      if (this.stream && this.stopStream()) {
        this.initStream();
      }
    }
  }
  // tslint:disable-next-line:variable-name
  private _mediaConstraints: EMediaConstraints;
  @Input()
  set filters(v: string) {
    this._filters = v;
    if (this.ctx) {
      this.ctx.filter = v;
    }
  }
  // tslint:disable-next-line:variable-name
  private _filters: string;

  video = document.createElement('video');
  @ViewChild('opencam', {static: true})
  canvas;
  ctx: CanvasRenderingContext2D;

  private videoSources: ISourceDevice[] = [];
  private audioSources: ISourceDevice[] = [];

  private currentVideoSource: ISourceDevice;
  private currentAudioSource: ISourceDevice;

  private rafId;
  private stream;
  private constraints: any = {
    audio: {},
    video: {}
  };

  isStreamLoading: boolean;
  isStreamInProgress: boolean;
  isRecording: boolean;
  isScanCompleted: boolean;
  recorder;

  frames: string[];

  constructor() {}

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    const sizeWidth = this.ctx.canvas.clientWidth;
    const sizeHeight = this.ctx.canvas.clientHeight;
    this.canvas.width = sizeWidth;
    this.canvas.height = sizeHeight;
    this.isScanCompleted = false;
    this.initOpenCam();
  }

  initOpenCam() {
    navigator.mediaDevices
      .ondevicechange = (e) => this.scanCaptureDevices();
    this.scanCaptureDevices();
  }

  scanCaptureDevices() {
    navigator.mediaDevices
      .enumerateDevices()
      .then((d: MediaDeviceInfo[]) => { this.handleCaptureDevices(d); /*this.initStream();*/ })
      .catch((e) => this.errorHandler(e));
  }

  sourceHandler() {
    this.videoSourceEvent.emit(this.videoSources);
    this.audioSourceEvent.emit(this.audioSources);
  }

  captureHandler(c) {
    this.captureEvent.emit(c);
  }

  errorHandler(e) {
    this.errorEvent.emit(e);
  }

  private handleCaptureDevices(devicesInfos: MediaDeviceInfo[]) {
      let devicesFound = 0;
      this.videoSources = [];
      this.audioSources = [];
        // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < devicesInfos.length; i++) {
            if (devicesInfos[i].kind === 'videoinput') {
              if(devicesInfos[i].deviceId !== undefined) {
                devicesFound++;
                this.videoSources.push({
                  id: devicesInfos[i].deviceId,
                  label: devicesInfos[i].label,
                  kind: devicesInfos[i].kind,
                });
              }
            }
            if (devicesInfos[i].kind === 'audioinput') {
              if(devicesInfos[i].deviceId !== undefined) {
                this.audioSources.push({
                  id: devicesInfos[i].deviceId,
                  label: devicesInfos[i].label,
                  kind: devicesInfos[i].kind,
                });
              }
            }
      }
      if (devicesFound === 0) {
        const e = new Error();
        e.name = 'No devices available';
        e.message = 'Useful devices not found during scan';
        this.errorHandler(e);
      } else {
        // emit devices
        this.sourceHandler();
      }
      this.isScanCompleted = true;
  }

  private initStream() {
    if (this.videoSources.length > 0) {

      if (!this._videoSource) {
        this.currentVideoSource = this.videoSources[0];
      } else {
        this.currentVideoSource = this._videoSource;
      }

      if (!this._audioSource) {
        this.currentAudioSource = null;
        this.constraints.audio = false;
      } else {
        this.currentAudioSource = this._audioSource as ISourceDevice;
        this.constraints.audio = { deviceId: { exact: this.currentAudioSource.id }};
      }

      this.constraints.video.deviceId = { exact: this.currentVideoSource.id };

      console.log(this.constraints, this.videoSources);

      navigator.mediaDevices.getUserMedia(this.constraints)
      .then( (stream) => {
            this.video.addEventListener('loadedmetadata', () => {
              this.canvas.clientWidth = this.video.videoWidth;
              this.canvas.clientHeight = this.video.videoHeight;
            });
            this.video.addEventListener('play', () => this.drawToCanvas());
            this.stream = stream;
            this.video.srcObject = this.stream;
            this.video.muted = true;
            this.video.controls = false;
            if(this._streamState === EStreamState.PLAY) {
              this.video.play();
            }
        }).catch( (error) => {
          this.errorHandler(error);
        });

    } else {
      const e = new Error();
      e.name = 'Video stream init failed';
      e.message = 'No devices available for stream';
      this.errorHandler(e);
    }
  }

  getAudioStream() {
    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaStreamSource(this.stream);
    const destination = audioCtx.createMediaStreamDestination();
    source.connect(destination);
    source.connect(audioCtx.destination);
    const audioStream = destination.stream;
    return audioStream;
  }

  private startRecording() {
    this.isRecording = true;
    // frames recorded only on re-renders
    // @ts-ignore
    const videoStream = this.canvas.nativeElement.captureStream(this._framerate);
    // const audioStream = this.getAudioStream();
    let stream;
    if (this._audioSource) {
      stream = new MediaStream([
        ...this.stream.getAudioTracks(),
        ...videoStream.getTracks()
      ]);
    } else {
      stream = videoStream;
    }
    // @ts-ignore
    this.recorder = new MediaRecorder(stream);
    this.frames = [];
    this.recorder.ondataavailable = (e) => this.extractRecording(e);
    this.recorder.start();
  }

  extractRecording(e) {
    this.frames.push(e.data);
    const webmBlob = new Blob(this.frames, { type: 'video/webm' });
    const downloadUrl = URL.createObjectURL(webmBlob);
    this.captureHandler(downloadUrl);
    this.recorder = null;
  }

  private stopRecording() {
    this.recorder.stop();
    this.isRecording = false;
  }

  private drawToCanvas() {
    this.ctx.drawImage(this.video, 0, 0);
    setTimeout(() => this.drawToCanvas(), (1000 / this._framerate));
  }

  private captureStreamShot() {
    if (this.video) {
      const canvas = document.createElement('canvas');
      canvas.width = this.video.videoWidth;
      canvas.height = this.video.videoHeight;
      canvas.getContext('2d').drawImage(this.canvas.nativeElement, 0, 0);
      const data = canvas.toDataURL();
      return data;
    }
  }

  stopStream() {
    if (this.stream) {
      this.stream.getTracks().forEach(
        (track) => {
        track.stop();
      });
    }
    this.stream = null;
    return true;
  }

  ngOnDestroy(): void {
    this.stopStream();
  }

}
