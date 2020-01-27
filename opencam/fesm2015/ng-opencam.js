import 'rxjs';
import { Injectable, NgModule, Component, Input, Output, EventEmitter, ViewChild, ɵɵdefineInjectable } from '@angular/core';

/**
 * @fileoverview added by tsickle
 * Generated from: lib/opencam.service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class OpencamService {
    constructor() { }
}
OpencamService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */
OpencamService.ctorParameters = () => [];
/** @nocollapse */ OpencamService.ngInjectableDef = ɵɵdefineInjectable({ factory: function OpencamService_Factory() { return new OpencamService(); }, token: OpencamService, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * Generated from: lib/opencam.models.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {string} */
const ECaptureType = {
    VIDEO: "video",
    PICTURE: "picture",
};
/** @enum {string} */
const EStreamState = {
    PLAY: "play",
    PAUSE: "pause",
    STOP: "stop",
};
/** @enum {string} */
const EMediaConstraints = {
    HD: "hd",
    VGA: "vga",
    FHD: "fhd",
    DEFAULT: "default",
};

/**
 * @fileoverview added by tsickle
 * Generated from: lib/opencam.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class OpencamComponent {
    constructor() {
        this.captureEvent = new EventEmitter(true);
        this.videoSourceEvent = new EventEmitter(true);
        this.audioSourceEvent = new EventEmitter(true);
        this.errorEvent = new EventEmitter(true);
        // tslint:disable-next-line:variable-name
        this._framerate = 30;
        // tslint:disable-next-line:variable-name
        this._audioSource = null;
        this.video = document.createElement('video');
        this.videoSources = [];
        this.audioSources = [];
        this.constraints = {
            audio: {},
            video: {}
        };
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set framerate(v) {
        if (v > 0 && v <= 60) {
            this._framerate = Math.abs(v);
        }
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set videoSource(v) {
        if (this.isScanCompleted) {
            if (v) {
                this._videoSource = v;
                this.stopStream();
                this.initStream();
            }
        }
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set audioSource(v) {
        if (this.isScanCompleted) {
            this._audioSource = v;
            this.stopStream();
            this.initStream();
        }
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set width(v) {
        if (v !== null) {
            this._width = v;
        }
        else {
            this.display = 'none';
        }
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set height(v) {
        if (v !== null) {
            this._height = v;
        }
        else {
            this.display = 'none';
        }
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set capture(v) {
        v.subscribe((/**
         * @param {?} c
         * @return {?}
         */
        (c) => {
            setTimeout((/**
             * @return {?}
             */
            () => {
                if (this.stream) {
                    if (this._captureType === ECaptureType.VIDEO) {
                        if (!this.isRecording) {
                            this.startRecording();
                        }
                        else {
                            this.stopRecording();
                        }
                    }
                    else {
                        /** @type {?} */
                        const img = this.captureStreamShot();
                        if (img) {
                            this.captureHandler(img);
                        }
                    }
                }
            }), 1000 * Math.abs(c));
        }));
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set captureType(v) {
        this._captureType = v;
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set streamState(v) {
        if (v) {
            this._streamState = v;
            if (this.stream !== undefined && this.stream !== null) {
                if (v === EStreamState.PLAY) {
                    this.video.play();
                    if (this.recorder) {
                        this.recorder.resume();
                    }
                }
                else if (v === EStreamState.PAUSE) {
                    this.video.pause();
                    if (this.recorder) {
                        this.recorder.pause();
                    }
                }
                else if (v === EStreamState.STOP) {
                    this.video.pause();
                    if (this.recorder) {
                        this.recorder.stop();
                    }
                    this.stopStream();
                    this.video.srcObject = null;
                }
            }
            else {
                if (v === EStreamState.PLAY && this.videoSources.length > 0) {
                    this.initStream();
                }
            }
        }
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set mediaConstraints(v) {
        if (v) {
            this._mediaConstraints = v;
            if (v === EMediaConstraints.HD) {
                this.constraints.video.width = { min: 1280 };
                this.constraints.video.height = { min: 720 };
            }
            else if (v === EMediaConstraints.FHD) {
                this.constraints.video.width = { min: 1920 };
                this.constraints.video.height = { min: 1080 };
            }
            else if (v === EMediaConstraints.VGA) {
                this.constraints.video.width = { min: 640 };
                this.constraints.video.height = { min: 480 };
            }
            else {
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
    /**
     * @param {?} v
     * @return {?}
     */
    set filters(v) {
        this._filters = v;
        if (this.ctx) {
            this.ctx.filter = v;
        }
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.ctx = this.canvas.nativeElement.getContext('2d');
        /** @type {?} */
        const sizeWidth = this.ctx.canvas.clientWidth;
        /** @type {?} */
        const sizeHeight = this.ctx.canvas.clientHeight;
        this.canvas.width = sizeWidth;
        this.canvas.height = sizeHeight;
        this.isScanCompleted = false;
        this.initOpenCam();
    }
    /**
     * @return {?}
     */
    initOpenCam() {
        navigator.mediaDevices
            .ondevicechange = (/**
         * @param {?} e
         * @return {?}
         */
        (e) => this.scanCaptureDevices());
        this.scanCaptureDevices();
    }
    /**
     * @return {?}
     */
    scanCaptureDevices() {
        navigator.mediaDevices
            .enumerateDevices()
            .then((/**
         * @param {?} d
         * @return {?}
         */
        (d) => { this.handleCaptureDevices(d); /*this.initStream();*/ }))
            .catch((/**
         * @param {?} e
         * @return {?}
         */
        (e) => this.errorHandler(e)));
    }
    /**
     * @return {?}
     */
    sourceHandler() {
        this.videoSourceEvent.emit(this.videoSources);
        this.audioSourceEvent.emit(this.audioSources);
    }
    /**
     * @param {?} c
     * @return {?}
     */
    captureHandler(c) {
        this.captureEvent.emit(c);
    }
    /**
     * @param {?} e
     * @return {?}
     */
    errorHandler(e) {
        this.errorEvent.emit(e);
    }
    /**
     * @private
     * @param {?} devicesInfos
     * @return {?}
     */
    handleCaptureDevices(devicesInfos) {
        /** @type {?} */
        let devicesFound = 0;
        this.videoSources = [];
        this.audioSources = [];
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < devicesInfos.length; i++) {
            if (devicesInfos[i].kind === 'videoinput') {
                if (devicesInfos[i].deviceId !== undefined) {
                    devicesFound++;
                    this.videoSources.push({
                        id: devicesInfos[i].deviceId,
                        label: devicesInfos[i].label,
                        kind: devicesInfos[i].kind,
                    });
                }
            }
            if (devicesInfos[i].kind === 'audioinput') {
                if (devicesInfos[i].deviceId !== undefined) {
                    this.audioSources.push({
                        id: devicesInfos[i].deviceId,
                        label: devicesInfos[i].label,
                        kind: devicesInfos[i].kind,
                    });
                }
            }
        }
        if (devicesFound === 0) {
            /** @type {?} */
            const e = new Error();
            e.name = 'No devices available';
            e.message = 'Useful devices not found during scan';
            this.errorHandler(e);
        }
        else {
            // emit devices
            this.sourceHandler();
        }
        this.isScanCompleted = true;
    }
    /**
     * @private
     * @return {?}
     */
    initStream() {
        if (this.videoSources.length > 0) {
            if (!this._videoSource) {
                this.currentVideoSource = this.videoSources[0];
            }
            else {
                this.currentVideoSource = this._videoSource;
            }
            if (!this._audioSource) {
                this.currentAudioSource = null;
                this.constraints.audio = false;
            }
            else {
                this.currentAudioSource = (/** @type {?} */ (this._audioSource));
                this.constraints.audio = { deviceId: { exact: this.currentAudioSource.id } };
            }
            this.constraints.video.deviceId = { exact: this.currentVideoSource.id };
            navigator.mediaDevices.getUserMedia(this.constraints)
                .then((/**
             * @param {?} stream
             * @return {?}
             */
            (stream) => {
                this.video.addEventListener('loadedmetadata', (/**
                 * @return {?}
                 */
                () => {
                    this.canvas.clientWidth = this.video.videoWidth;
                    this.canvas.clientHeight = this.video.videoHeight;
                }));
                this.video.addEventListener('play', (/**
                 * @return {?}
                 */
                () => this.drawToCanvas()));
                this.stream = stream;
                this.video.srcObject = this.stream;
                this.video.muted = true;
                this.video.controls = false;
                if (this._streamState === EStreamState.PLAY) {
                    this.video.play();
                }
            })).catch((/**
             * @param {?} error
             * @return {?}
             */
            (error) => {
                this.errorHandler(error);
            }));
        }
        else {
            /** @type {?} */
            const e = new Error();
            e.name = 'Video stream init failed';
            e.message = 'No devices available for stream';
            this.errorHandler(e);
        }
    }
    /**
     * @return {?}
     */
    getAudioStream() {
        /** @type {?} */
        const audioCtx = new AudioContext();
        /** @type {?} */
        const source = audioCtx.createMediaStreamSource(this.stream);
        /** @type {?} */
        const destination = audioCtx.createMediaStreamDestination();
        source.connect(destination);
        source.connect(audioCtx.destination);
        /** @type {?} */
        const audioStream = destination.stream;
        return audioStream;
    }
    /**
     * @private
     * @return {?}
     */
    startRecording() {
        this.isRecording = true;
        // frames recorded only on re-renders
        // @ts-ignore
        /** @type {?} */
        const videoStream = this.canvas.nativeElement.captureStream(this._framerate);
        // const audioStream = this.getAudioStream();
        /** @type {?} */
        let stream;
        if (this._audioSource) {
            stream = new MediaStream([
                ...this.stream.getAudioTracks(),
                ...videoStream.getTracks()
            ]);
        }
        else {
            stream = videoStream;
        }
        // @ts-ignore
        this.recorder = new MediaRecorder(stream);
        this.frames = [];
        this.recorder.ondataavailable = (/**
         * @param {?} e
         * @return {?}
         */
        (e) => this.extractRecording(e));
        this.recorder.start();
    }
    /**
     * @param {?} e
     * @return {?}
     */
    extractRecording(e) {
        this.frames.push(e.data);
        /** @type {?} */
        const webmBlob = new Blob(this.frames, { type: 'video/webm' });
        /** @type {?} */
        const downloadUrl = URL.createObjectURL(webmBlob);
        this.captureHandler(downloadUrl);
        this.recorder = null;
    }
    /**
     * @private
     * @return {?}
     */
    stopRecording() {
        this.recorder.stop();
        this.isRecording = false;
    }
    /**
     * @private
     * @return {?}
     */
    drawToCanvas() {
        this.ctx.drawImage(this.video, 0, 0);
        setTimeout((/**
         * @return {?}
         */
        () => this.drawToCanvas()), (1000 / this._framerate));
    }
    /**
     * @private
     * @return {?}
     */
    captureStreamShot() {
        if (this.video) {
            /** @type {?} */
            const canvas = document.createElement('canvas');
            canvas.width = this.video.videoWidth;
            canvas.height = this.video.videoHeight;
            canvas.getContext('2d').drawImage(this.canvas.nativeElement, 0, 0);
            /** @type {?} */
            const data = canvas.toDataURL();
            return data;
        }
    }
    /**
     * @return {?}
     */
    stopStream() {
        if (this.stream) {
            this.stream.getTracks().forEach((/**
             * @param {?} track
             * @return {?}
             */
            (track) => {
                track.stop();
            }));
        }
        this.stream = null;
        return true;
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.stopStream();
    }
}
OpencamComponent.decorators = [
    { type: Component, args: [{
                selector: 'ng-opencam',
                template: "<canvas [style.display]='this.display' #opencam [style.height]='this._height' [style.width]='this._width' [height]=\"this.video.videoHeight\" [width]=\"this.video.videoWidth\"></canvas>\n"
            }] }
];
/** @nocollapse */
OpencamComponent.ctorParameters = () => [];
OpencamComponent.propDecorators = {
    captureEvent: [{ type: Output }],
    videoSourceEvent: [{ type: Output }],
    audioSourceEvent: [{ type: Output }],
    errorEvent: [{ type: Output }],
    framerate: [{ type: Input }],
    videoSource: [{ type: Input }],
    audioSource: [{ type: Input }],
    width: [{ type: Input }],
    height: [{ type: Input }],
    capture: [{ type: Input }],
    captureType: [{ type: Input }],
    streamState: [{ type: Input }],
    mediaConstraints: [{ type: Input }],
    filters: [{ type: Input }],
    canvas: [{ type: ViewChild, args: ['opencam', { static: true },] }]
};

/**
 * @fileoverview added by tsickle
 * Generated from: lib/opencam.module.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class OpencamModule {
}
OpencamModule.decorators = [
    { type: NgModule, args: [{
                declarations: [OpencamComponent],
                imports: [],
                exports: [OpencamComponent]
            },] }
];

/**
 * @fileoverview added by tsickle
 * Generated from: public-api.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: ng-opencam.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { OpencamService, OpencamComponent, OpencamModule, ECaptureType, EStreamState, EMediaConstraints };

//# sourceMappingURL=ng-opencam.js.map