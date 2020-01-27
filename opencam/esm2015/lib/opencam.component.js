/**
 * @fileoverview added by tsickle
 * Generated from: lib/opencam.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ECaptureType, EStreamState, EMediaConstraints } from './opencam.models';
import { Observable } from 'rxjs';
export class OpencamComponent {
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
if (false) {
    /** @type {?} */
    OpencamComponent.prototype.captureEvent;
    /** @type {?} */
    OpencamComponent.prototype.videoSourceEvent;
    /** @type {?} */
    OpencamComponent.prototype.audioSourceEvent;
    /** @type {?} */
    OpencamComponent.prototype.errorEvent;
    /**
     * @type {?}
     * @private
     */
    OpencamComponent.prototype._framerate;
    /**
     * @type {?}
     * @private
     */
    OpencamComponent.prototype._videoSource;
    /**
     * @type {?}
     * @private
     */
    OpencamComponent.prototype._audioSource;
    /** @type {?} */
    OpencamComponent.prototype.display;
    /** @type {?} */
    OpencamComponent.prototype._width;
    /** @type {?} */
    OpencamComponent.prototype._height;
    /**
     * @type {?}
     * @private
     */
    OpencamComponent.prototype._capture;
    /**
     * @type {?}
     * @private
     */
    OpencamComponent.prototype._captureType;
    /**
     * @type {?}
     * @private
     */
    OpencamComponent.prototype._streamState;
    /**
     * @type {?}
     * @private
     */
    OpencamComponent.prototype._mediaConstraints;
    /**
     * @type {?}
     * @private
     */
    OpencamComponent.prototype._filters;
    /** @type {?} */
    OpencamComponent.prototype.video;
    /** @type {?} */
    OpencamComponent.prototype.canvas;
    /** @type {?} */
    OpencamComponent.prototype.ctx;
    /**
     * @type {?}
     * @private
     */
    OpencamComponent.prototype.videoSources;
    /**
     * @type {?}
     * @private
     */
    OpencamComponent.prototype.audioSources;
    /**
     * @type {?}
     * @private
     */
    OpencamComponent.prototype.currentVideoSource;
    /**
     * @type {?}
     * @private
     */
    OpencamComponent.prototype.currentAudioSource;
    /**
     * @type {?}
     * @private
     */
    OpencamComponent.prototype.rafId;
    /**
     * @type {?}
     * @private
     */
    OpencamComponent.prototype.stream;
    /**
     * @type {?}
     * @private
     */
    OpencamComponent.prototype.constraints;
    /** @type {?} */
    OpencamComponent.prototype.isStreamLoading;
    /** @type {?} */
    OpencamComponent.prototype.isStreamInProgress;
    /** @type {?} */
    OpencamComponent.prototype.isRecording;
    /** @type {?} */
    OpencamComponent.prototype.isScanCompleted;
    /** @type {?} */
    OpencamComponent.prototype.recorder;
    /** @type {?} */
    OpencamComponent.prototype.frames;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3BlbmNhbS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy1vcGVuY2FtLyIsInNvdXJjZXMiOlsibGliL29wZW5jYW0uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQWEsTUFBTSxlQUFlLENBQUM7QUFDckcsT0FBTyxFQUFpQixZQUFZLEVBQUUsWUFBWSxFQUFFLGlCQUFpQixFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDaEcsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQU9sQyxNQUFNLE9BQU8sZ0JBQWdCO0lBK0wzQjtRQTVMQSxpQkFBWSxHQUFzQixJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV6RCxxQkFBZ0IsR0FBa0MsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFekUscUJBQWdCLEdBQWtDLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXpFLGVBQVUsR0FBd0IsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7O1FBU2pELGVBQVUsR0FBRyxFQUFFLENBQUM7O1FBdUJoQixpQkFBWSxHQUFrQixJQUFJLENBQUM7UUE0SDNDLFVBQUssR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBS2hDLGlCQUFZLEdBQW9CLEVBQUUsQ0FBQztRQUNuQyxpQkFBWSxHQUFvQixFQUFFLENBQUM7UUFPbkMsZ0JBQVcsR0FBUTtZQUN6QixLQUFLLEVBQUUsRUFBRTtZQUNULEtBQUssRUFBRSxFQUFFO1NBQ1YsQ0FBQztJQVVhLENBQUM7Ozs7O0lBcExoQixJQUNJLFNBQVMsQ0FBQyxDQUFTO1FBQ3JCLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ3BCLElBQUksQ0FBQyxVQUFVLEdB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NENBQ3lFOztJQUN6RSxzQ0FDeUQ7Ozs7O0lBU3pELHNDQUF3Qjs7Ozs7SUFheEIsd0NBQW9DOzs7OztJQVVwQyx3Q0FBMkM7O0lBQzNDLG1DQUFnQjs7SUFVaEIsa0NBQWU7O0lBVWYsbUNBQWdCOzs7OztJQXVCaEIsb0NBQXFDOzs7OztJQU1yQyx3Q0FBbUM7Ozs7O0lBZ0NuQyx3Q0FBbUM7Ozs7O0lBK0JuQyw2Q0FBNkM7Ozs7O0lBUzdDLG9DQUF5Qjs7SUFFekIsaUNBQXdDOztJQUN4QyxrQ0FDTzs7SUFDUCwrQkFBOEI7Ozs7O0lBRTlCLHdDQUEyQzs7Ozs7SUFDM0Msd0NBQTJDOzs7OztJQUUzQyw4Q0FBMEM7Ozs7O0lBQzFDLDhDQUEwQzs7Ozs7SUFFMUMsaUNBQWM7Ozs7O0lBQ2Qsa0NBQWU7Ozs7O0lBQ2YsdUNBR0U7O0lBRUYsMkNBQXlCOztJQUN6Qiw4Q0FBNEI7O0lBQzVCLHVDQUFxQjs7SUFDckIsMkNBQXlCOztJQUN6QixvQ0FBUzs7SUFFVCxrQ0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBWaWV3Q2hpbGQsIE9uRGVzdHJveSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSVNvdXJjZURldmljZSwgRUNhcHR1cmVUeXBlLCBFU3RyZWFtU3RhdGUsIEVNZWRpYUNvbnN0cmFpbnRzIH0gZnJvbSAnLi9vcGVuY2FtLm1vZGVscyc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25nLW9wZW5jYW0nLFxuICB0ZW1wbGF0ZVVybDogJy4vb3BlbmNhbS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlczogW11cbn0pXG5leHBvcnQgY2xhc3MgT3BlbmNhbUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcblxuICBAT3V0cHV0KClcbiAgY2FwdHVyZUV2ZW50OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIodHJ1ZSk7XG4gIEBPdXRwdXQoKVxuICB2aWRlb1NvdXJjZUV2ZW50OiBFdmVudEVtaXR0ZXI8SVNvdXJjZURldmljZVtdPiA9IG5ldyBFdmVudEVtaXR0ZXIodHJ1ZSk7XG4gIEBPdXRwdXQoKVxuICBhdWRpb1NvdXJjZUV2ZW50OiBFdmVudEVtaXR0ZXI8SVNvdXJjZURldmljZVtdPiA9IG5ldyBFdmVudEVtaXR0ZXIodHJ1ZSk7XG4gIEBPdXRwdXQoKVxuICBlcnJvckV2ZW50OiBFdmVudEVtaXR0ZXI8RXJyb3I+ID0gbmV3IEV2ZW50RW1pdHRlcih0cnVlKTtcblxuICBASW5wdXQoKVxuICBzZXQgZnJhbWVyYXRlKHY6IG51bWJlcikge1xuICAgIGlmICh2ID4gMCAmJiB2IDw9IDYwKSB7XG4gICAgICB0aGlzLl9mcmFtZXJhdGUgPSBNYXRoLmFicyh2KTtcbiAgICB9XG4gIH1cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWVcbiAgcHJpdmF0ZSBfZnJhbWVyYXRlID0gMzA7XG5cbiAgQElucHV0KClcbiAgc2V0IHZpZGVvU291cmNlKHY6IElTb3VyY2VEZXZpY2UpIHtcbiAgICBpZiAodGhpcy5pc1NjYW5Db21wbGV0ZWQpIHtcbiAgICAgIGlmICh2KSB7XG4gICAgICAgIHRoaXMuX3ZpZGVvU291cmNlID0gdjtcbiAgICAgICAgdGhpcy5zdG9wU3RyZWFtKCk7XG4gICAgICAgIHRoaXMuaW5pdFN0cmVhbSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZVxuICBwcml2YXRlIF92aWRlb1NvdXJjZTogSVNvdXJjZURldmljZTtcbiAgQElucHV0KClcbiAgc2V0IGF1ZGlvU291cmNlKHY6IElTb3VyY2VEZXZpY2UpIHtcbiAgICBpZiAodGhpcy5pc1NjYW5Db21wbGV0ZWQpIHtcbiAgICAgIHRoaXMuX2F1ZGlvU291cmNlID0gdjtcbiAgICAgIHRoaXMuc3RvcFN0cmVhbSgpO1xuICAgICAgdGhpcy5pbml0U3RyZWFtKCk7XG4gICAgfVxuICB9XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lXG4gIHByaXZhdGUgX2F1ZGlvU291cmNlOiBJU291cmNlRGV2aWNlID0gbnVsbDtcbiAgZGlzcGxheTogc3RyaW5nO1xuICBASW5wdXQoKVxuICBzZXQgd2lkdGgodjogc3RyaW5nKSB7XG4gICAgaWYgKHYgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuX3dpZHRoID0gdjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH1cbiAgfVxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZVxuICBfd2lkdGg6IHN0cmluZztcbiAgQElucHV0KClcbiAgc2V0IGhlaWdodCh2OiBzdHJpbmcpIHtcbiAgICBpZiAodiAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5faGVpZ2h0ID0gdjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH1cbiAgfVxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZVxuICBfaGVpZ2h0OiBzdHJpbmc7XG4gIEBJbnB1dCgpXG4gIHNldCBjYXB0dXJlKHY6IE9ic2VydmFibGU8bnVtYmVyPikge1xuICAgIHYuc3Vic2NyaWJlKFxuICAgICAgKGMpID0+IHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuc3RyZWFtKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fY2FwdHVyZVR5cGUgPT09IEVDYXB0dXJlVHlwZS5WSURFTykge1xuICAgICAgICAgICAgICBpZiAoIXRoaXMuaXNSZWNvcmRpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0UmVjb3JkaW5nKCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdG9wUmVjb3JkaW5nKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnN0IGltZyA9IHRoaXMuY2FwdHVyZVN0cmVhbVNob3QoKTtcbiAgICAgICAgICAgICAgaWYgKGltZykgeyB0aGlzLmNhcHR1cmVIYW5kbGVyKGltZyk7IH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sIDEwMDAgKiBNYXRoLmFicyhjKSk7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZVxuICBwcml2YXRlIF9jYXB0dXJlOiBPYnNlcnZhYmxlPG51bWJlcj47XG4gIEBJbnB1dCgpXG4gIHNldCBjYXB0dXJlVHlwZSh2OiBFQ2FwdHVyZVR5cGUpIHtcbiAgICB0aGlzLl9jYXB0dXJlVHlwZSA9IHY7XG4gIH1cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWVcbiAgcHJpdmF0ZSBfY2FwdHVyZVR5cGU6IEVDYXB0dXJlVHlwZTtcbiAgQElucHV0KClcbiAgc2V0IHN0cmVhbVN0YXRlKHY6IEVTdHJlYW1TdGF0ZSkge1xuICAgIGlmICh2KSB7XG4gICAgICB0aGlzLl9zdHJlYW1TdGF0ZSA9IHY7XG4gICAgICBpZiAodGhpcy5zdHJlYW0gIT09IHVuZGVmaW5lZCAmJiB0aGlzLnN0cmVhbSAhPT0gbnVsbCkge1xuICAgICAgICBpZiAodiA9PT0gRVN0cmVhbVN0YXRlLlBMQVkpIHtcbiAgICAgICAgICB0aGlzLnZpZGVvLnBsYXkoKTtcbiAgICAgICAgICBpZiAodGhpcy5yZWNvcmRlcikge1xuICAgICAgICAgICAgdGhpcy5yZWNvcmRlci5yZXN1bWUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodiA9PT0gRVN0cmVhbVN0YXRlLlBBVVNFKSB7XG4gICAgICAgICAgdGhpcy52aWRlby5wYXVzZSgpO1xuICAgICAgICAgIGlmICh0aGlzLnJlY29yZGVyKSB7XG4gICAgICAgICAgICB0aGlzLnJlY29yZGVyLnBhdXNlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHYgPT09IEVTdHJlYW1TdGF0ZS5TVE9QKSB7XG4gICAgICAgICAgdGhpcy52aWRlby5wYXVzZSgpO1xuICAgICAgICAgIGlmICh0aGlzLnJlY29yZGVyKSB7XG4gICAgICAgICAgICB0aGlzLnJlY29yZGVyLnN0b3AoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5zdG9wU3RyZWFtKCk7XG4gICAgICAgICAgdGhpcy52aWRlby5zcmNPYmplY3QgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodiA9PT0gRVN0cmVhbVN0YXRlLlBMQVkgJiYgdGhpcy52aWRlb1NvdXJjZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHRoaXMuaW5pdFN0cmVhbSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lXG4gIHByaXZhdGUgX3N0cmVhbVN0YXRlOiBFU3RyZWFtU3RhdGU7XG4gIEBJbnB1dCgpXG4gIHNldCBtZWRpYUNvbnN0cmFpbnRzKHY6IEVNZWRpYUNvbnN0cmFpbnRzKSB7XG4gICAgaWYgKHYpIHtcbiAgICAgIHRoaXMuX21lZGlhQ29uc3RyYWludHMgPSB2O1xuICAgICAgaWYgKHYgPT09IEVNZWRpYUNvbnN0cmFpbnRzLkhEKSB7XG4gICAgICAgIHRoaXMuY29uc3RyYWludHMudmlkZW8ud2lkdGggPSB7bWluOiAxMjgwfTtcbiAgICAgICAgdGhpcy5jb25zdHJhaW50cy52aWRlby5oZWlnaHQgPSB7bWluOiA3MjB9O1xuICAgICAgfSBlbHNlIGlmICh2ID09PSBFTWVkaWFDb25zdHJhaW50cy5GSEQpIHtcbiAgICAgICAgdGhpcy5jb25zdHJhaW50cy52aWRlby53aWR0aCA9IHttaW46IDE5MjB9O1xuICAgICAgICB0aGlzLmNvbnN0cmFpbnRzLnZpZGVvLmhlaWdodCA9IHttaW46IDEwODB9O1xuICAgICAgfSBlbHNlIGlmICh2ID09PSBFTWVkaWFDb25zdHJhaW50cy5WR0EpIHtcbiAgICAgICAgdGhpcy5jb25zdHJhaW50cy52aWRlby53aWR0aCA9IHttaW46IDY0MH07XG4gICAgICAgIHRoaXMuY29uc3RyYWludHMudmlkZW8uaGVpZ2h0ID0ge21pbjogNDgwfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLmNvbnN0cmFpbnRzICYmIHRoaXMuY29uc3RyYWludHMudmlkZW8pIHtcbiAgICAgICAgICBpZiAodGhpcy5jb25zdHJhaW50cy52aWRlby53aWR0aCkge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuY29uc3RyYWludHMudmlkZW8ud2lkdGg7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0aGlzLmNvbnN0cmFpbnRzLnZpZGVvLmhlaWdodCkge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuY29uc3RyYWludHMudmlkZW8uaGVpZ2h0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICB9XG4gICAgICBpZiAodGhpcy5zdHJlYW0gJiYgdGhpcy5zdG9wU3RyZWFtKCkpIHtcbiAgICAgICAgdGhpcy5pbml0U3RyZWFtKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lXG4gIHByaXZhdGUgX21lZGlhQ29uc3RyYWludHM6IEVNZWRpYUNvbnN0cmFpbnRzO1xuICBASW5wdXQoKVxuICBzZXQgZmlsdGVycyh2OiBzdHJpbmcpIHtcbiAgICB0aGlzLl9maWx0ZXJzID0gdjtcbiAgICBpZiAodGhpcy5jdHgpIHtcbiAgICAgIHRoaXMuY3R4LmZpbHRlciA9IHY7XG4gICAgfVxuICB9XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lXG4gIHByaXZhdGUgX2ZpbHRlcnM6IHN0cmluZztcblxuICB2aWRlbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ZpZGVvJyk7XG4gIEBWaWV3Q2hpbGQoJ29wZW5jYW0nLCB7c3RhdGljOiB0cnVlfSlcbiAgY2FudmFzO1xuICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcblxuICBwcml2YXRlIHZpZGVvU291cmNlczogSVNvdXJjZURldmljZVtdID0gW107XG4gIHByaXZhdGUgYXVkaW9Tb3VyY2VzOiBJU291cmNlRGV2aWNlW10gPSBbXTtcblxuICBwcml2YXRlIGN1cnJlbnRWaWRlb1NvdXJjZTogSVNvdXJjZURldmljZTtcbiAgcHJpdmF0ZSBjdXJyZW50QXVkaW9Tb3VyY2U6IElTb3VyY2VEZXZpY2U7XG5cbiAgcHJpdmF0ZSByYWZJZDtcbiAgcHJpdmF0ZSBzdHJlYW07XG4gIHByaXZhdGUgY29uc3RyYWludHM6IGFueSA9IHtcbiAgICBhdWRpbzoge30sXG4gICAgdmlkZW86IHt9XG4gIH07XG5cbiAgaXNTdHJlYW1Mb2FkaW5nOiBib29sZWFuO1xuICBpc1N0cmVhbUluUHJvZ3Jlc3M6IGJvb2xlYW47XG4gIGlzUmVjb3JkaW5nOiBib29sZWFuO1xuICBpc1NjYW5Db21wbGV0ZWQ6IGJvb2xlYW47XG4gIHJlY29yZGVyO1xuXG4gIGZyYW1lczogc3RyaW5nW107XG5cbiAgY29uc3RydWN0b3IoKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMubmF0aXZlRWxlbWVudC5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNvbnN0IHNpemVXaWR0aCA9IHRoaXMuY3R4LmNhbnZhcy5jbGllbnRXaWR0aDtcbiAgICBjb25zdCBzaXplSGVpZ2h0ID0gdGhpcy5jdHguY2FudmFzLmNsaWVudEhlaWdodDtcbiAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHNpemVXaWR0aDtcbiAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSBzaXplSGVpZ2h0O1xuICAgIHRoaXMuaXNTY2FuQ29tcGxldGVkID0gZmFsc2U7XG4gICAgdGhpcy5pbml0T3BlbkNhbSgpO1xuICB9XG5cbiAgaW5pdE9wZW5DYW0oKSB7XG4gICAgbmF2aWdhdG9yLm1lZGlhRGV2aWNlc1xuICAgICAgLm9uZGV2aWNlY2hhbmdlID0gKGUpID0+IHRoaXMuc2NhbkNhcHR1cmVEZXZpY2VzKCk7XG4gICAgdGhpcy5zY2FuQ2FwdHVyZURldmljZXMoKTtcbiAgfVxuXG4gIHNjYW5DYXB0dXJlRGV2aWNlcygpIHtcbiAgICBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzXG4gICAgICAuZW51bWVyYXRlRGV2aWNlcygpXG4gICAgICAudGhlbigoZDogTWVkaWFEZXZpY2VJbmZvW10pID0+IHsgdGhpcy5oYW5kbGVDYXB0dXJlRGV2aWNlcyhkKTsgLyp0aGlzLmluaXRTdHJlYW0oKTsqLyB9KVxuICAgICAgLmNhdGNoKChlKSA9PiB0aGlzLmVycm9ySGFuZGxlcihlKSk7XG4gIH1cblxuICBzb3VyY2VIYW5kbGVyKCkge1xuICAgIHRoaXMudmlkZW9Tb3VyY2VFdmVudC5lbWl0KHRoaXMudmlkZW9Tb3VyY2VzKTtcbiAgICB0aGlzLmF1ZGlvU291cmNlRXZlbnQuZW1pdCh0aGlzLmF1ZGlvU291cmNlcyk7XG4gIH1cblxuICBjYXB0dXJlSGFuZGxlcihjKSB7XG4gICAgdGhpcy5jYXB0dXJlRXZlbnQuZW1pdChjKTtcbiAgfVxuXG4gIGVycm9ySGFuZGxlcihlKSB7XG4gICAgdGhpcy5lcnJvckV2ZW50LmVtaXQoZSk7XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZUNhcHR1cmVEZXZpY2VzKGRldmljZXNJbmZvczogTWVkaWFEZXZpY2VJbmZvW10pIHtcbiAgICAgIGxldCBkZXZpY2VzRm91bmQgPSAwO1xuICAgICAgdGhpcy52aWRlb1NvdXJjZXMgPSBbXTtcbiAgICAgIHRoaXMuYXVkaW9Tb3VyY2VzID0gW107XG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpwcmVmZXItZm9yLW9mXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRldmljZXNJbmZvcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGRldmljZXNJbmZvc1tpXS5raW5kID09PSAndmlkZW9pbnB1dCcpIHtcbiAgICAgICAgICAgICAgaWYoZGV2aWNlc0luZm9zW2ldLmRldmljZUlkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBkZXZpY2VzRm91bmQrKztcbiAgICAgICAgICAgICAgICB0aGlzLnZpZGVvU291cmNlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgIGlkOiBkZXZpY2VzSW5mb3NbaV0uZGV2aWNlSWQsXG4gICAgICAgICAgICAgICAgICBsYWJlbDogZGV2aWNlc0luZm9zW2ldLmxhYmVsLFxuICAgICAgICAgICAgICAgICAga2luZDogZGV2aWNlc0luZm9zW2ldLmtpbmQsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkZXZpY2VzSW5mb3NbaV0ua2luZCA9PT0gJ2F1ZGlvaW5wdXQnKSB7XG4gICAgICAgICAgICAgIGlmKGRldmljZXNJbmZvc1tpXS5kZXZpY2VJZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdWRpb1NvdXJjZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICBpZDogZGV2aWNlc0luZm9zW2ldLmRldmljZUlkLFxuICAgICAgICAgICAgICAgICAgbGFiZWw6IGRldmljZXNJbmZvc1tpXS5sYWJlbCxcbiAgICAgICAgICAgICAgICAgIGtpbmQ6IGRldmljZXNJbmZvc1tpXS5raW5kLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZGV2aWNlc0ZvdW5kID09PSAwKSB7XG4gICAgICAgIGNvbnN0IGUgPSBuZXcgRXJyb3IoKTtcbiAgICAgICAgZS5uYW1lID0gJ05vIGRldmljZXMgYXZhaWxhYmxlJztcbiAgICAgICAgZS5tZXNzYWdlID0gJ1VzZWZ1bCBkZXZpY2VzIG5vdCBmb3VuZCBkdXJpbmcgc2Nhbic7XG4gICAgICAgIHRoaXMuZXJyb3JIYW5kbGVyKGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gZW1pdCBkZXZpY2VzXG4gICAgICAgIHRoaXMuc291cmNlSGFuZGxlcigpO1xuICAgICAgfVxuICAgICAgdGhpcy5pc1NjYW5Db21wbGV0ZWQgPSB0cnVlO1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0U3RyZWFtKCkge1xuICAgIGlmICh0aGlzLnZpZGVvU291cmNlcy5sZW5ndGggPiAwKSB7XG5cbiAgICAgIGlmICghdGhpcy5fdmlkZW9Tb3VyY2UpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50VmlkZW9Tb3VyY2UgPSB0aGlzLnZpZGVvU291cmNlc1swXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY3VycmVudFZpZGVvU291cmNlID0gdGhpcy5fdmlkZW9Tb3VyY2U7XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5fYXVkaW9Tb3VyY2UpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50QXVkaW9Tb3VyY2UgPSBudWxsO1xuICAgICAgICB0aGlzLmNvbnN0cmFpbnRzLmF1ZGlvID0gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmN1cnJlbnRBdWRpb1NvdXJjZSA9IHRoaXMuX2F1ZGlvU291cmNlIGFzIElTb3VyY2VEZXZpY2U7XG4gICAgICAgIHRoaXMuY29uc3RyYWludHMuYXVkaW8gPSB7IGRldmljZUlkOiB7IGV4YWN0OiB0aGlzLmN1cnJlbnRBdWRpb1NvdXJjZS5pZCB9fTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jb25zdHJhaW50cy52aWRlby5kZXZpY2VJZCA9IHsgZXhhY3Q6IHRoaXMuY3VycmVudFZpZGVvU291cmNlLmlkIH07XG5cbiAgICAgIG5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKHRoaXMuY29uc3RyYWludHMpXG4gICAgICAudGhlbiggKHN0cmVhbSkgPT4ge1xuICAgICAgICAgICAgdGhpcy52aWRlby5hZGRFdmVudExpc3RlbmVyKCdsb2FkZWRtZXRhZGF0YScsICgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5jYW52YXMuY2xpZW50V2lkdGggPSB0aGlzLnZpZGVvLnZpZGVvV2lkdGg7XG4gICAgICAgICAgICAgIHRoaXMuY2FudmFzLmNsaWVudEhlaWdodCA9IHRoaXMudmlkZW8udmlkZW9IZWlnaHQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMudmlkZW8uYWRkRXZlbnRMaXN0ZW5lcigncGxheScsICgpID0+IHRoaXMuZHJhd1RvQ2FudmFzKCkpO1xuICAgICAgICAgICAgdGhpcy5zdHJlYW0gPSBzdHJlYW07XG4gICAgICAgICAgICB0aGlzLnZpZGVvLnNyY09iamVjdCA9IHRoaXMuc3RyZWFtO1xuICAgICAgICAgICAgdGhpcy52aWRlby5tdXRlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnZpZGVvLmNvbnRyb2xzID0gZmFsc2U7XG4gICAgICAgICAgICBpZih0aGlzLl9zdHJlYW1TdGF0ZSA9PT0gRVN0cmVhbVN0YXRlLlBMQVkpIHtcbiAgICAgICAgICAgICAgdGhpcy52aWRlby5wbGF5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLmNhdGNoKCAoZXJyb3IpID0+IHtcbiAgICAgICAgICB0aGlzLmVycm9ySGFuZGxlcihlcnJvcik7XG4gICAgICAgIH0pO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGUgPSBuZXcgRXJyb3IoKTtcbiAgICAgIGUubmFtZSA9ICdWaWRlbyBzdHJlYW0gaW5pdCBmYWlsZWQnO1xuICAgICAgZS5tZXNzYWdlID0gJ05vIGRldmljZXMgYXZhaWxhYmxlIGZvciBzdHJlYW0nO1xuICAgICAgdGhpcy5lcnJvckhhbmRsZXIoZSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0QXVkaW9TdHJlYW0oKSB7XG4gICAgY29uc3QgYXVkaW9DdHggPSBuZXcgQXVkaW9Db250ZXh0KCk7XG4gICAgY29uc3Qgc291cmNlID0gYXVkaW9DdHguY3JlYXRlTWVkaWFTdHJlYW1Tb3VyY2UodGhpcy5zdHJlYW0pO1xuICAgIGNvbnN0IGRlc3RpbmF0aW9uID0gYXVkaW9DdHguY3JlYXRlTWVkaWFTdHJlYW1EZXN0aW5hdGlvbigpO1xuICAgIHNvdXJjZS5jb25uZWN0KGRlc3RpbmF0aW9uKTtcbiAgICBzb3VyY2UuY29ubmVjdChhdWRpb0N0eC5kZXN0aW5hdGlvbik7XG4gICAgY29uc3QgYXVkaW9TdHJlYW0gPSBkZXN0aW5hdGlvbi5zdHJlYW07XG4gICAgcmV0dXJuIGF1ZGlvU3RyZWFtO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGFydFJlY29yZGluZygpIHtcbiAgICB0aGlzLmlzUmVjb3JkaW5nID0gdHJ1ZTtcbiAgICAvLyBmcmFtZXMgcmVjb3JkZWQgb25seSBvbiByZS1yZW5kZXJzXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IHZpZGVvU3RyZWFtID0gdGhpcy5jYW52YXMubmF0aXZlRWxlbWVudC5jYXB0dXJlU3RyZWFtKHRoaXMuX2ZyYW1lcmF0ZSk7XG4gICAgLy8gY29uc3QgYXVkaW9TdHJlYW0gPSB0aGlzLmdldEF1ZGlvU3RyZWFtKCk7XG4gICAgbGV0IHN0cmVhbTtcbiAgICBpZiAodGhpcy5fYXVkaW9Tb3VyY2UpIHtcbiAgICAgIHN0cmVhbSA9IG5ldyBNZWRpYVN0cmVhbShbXG4gICAgICAgIC4uLnRoaXMuc3RyZWFtLmdldEF1ZGlvVHJhY2tzKCksXG4gICAgICAgIC4uLnZpZGVvU3RyZWFtLmdldFRyYWNrcygpXG4gICAgICBdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyZWFtID0gdmlkZW9TdHJlYW07XG4gICAgfVxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICB0aGlzLnJlY29yZGVyID0gbmV3IE1lZGlhUmVjb3JkZXIoc3RyZWFtKTtcbiAgICB0aGlzLmZyYW1lcyA9IFtdO1xuICAgIHRoaXMucmVjb3JkZXIub25kYXRhYXZhaWxhYmxlID0gKGUpID0+IHRoaXMuZXh0cmFjdFJlY29yZGluZyhlKTtcbiAgICB0aGlzLnJlY29yZGVyLnN0YXJ0KCk7XG4gIH1cblxuICBleHRyYWN0UmVjb3JkaW5nKGUpIHtcbiAgICB0aGlzLmZyYW1lcy5wdXNoKGUuZGF0YSk7XG4gICAgY29uc3Qgd2VibUJsb2IgPSBuZXcgQmxvYih0aGlzLmZyYW1lcywgeyB0eXBlOiAndmlkZW8vd2VibScgfSk7XG4gICAgY29uc3QgZG93bmxvYWRVcmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKHdlYm1CbG9iKTtcbiAgICB0aGlzLmNhcHR1cmVIYW5kbGVyKGRvd25sb2FkVXJsKTtcbiAgICB0aGlzLnJlY29yZGVyID0gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgc3RvcFJlY29yZGluZygpIHtcbiAgICB0aGlzLnJlY29yZGVyLnN0b3AoKTtcbiAgICB0aGlzLmlzUmVjb3JkaW5nID0gZmFsc2U7XG4gIH1cblxuICBwcml2YXRlIGRyYXdUb0NhbnZhcygpIHtcbiAgICB0aGlzLmN0eC5kcmF3SW1hZ2UodGhpcy52aWRlbywgMCwgMCk7XG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmRyYXdUb0NhbnZhcygpLCAoMTAwMCAvIHRoaXMuX2ZyYW1lcmF0ZSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBjYXB0dXJlU3RyZWFtU2hvdCgpIHtcbiAgICBpZiAodGhpcy52aWRlbykge1xuICAgICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICBjYW52YXMud2lkdGggPSB0aGlzLnZpZGVvLnZpZGVvV2lkdGg7XG4gICAgICBjYW52YXMuaGVpZ2h0ID0gdGhpcy52aWRlby52aWRlb0hlaWdodDtcbiAgICAgIGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpLmRyYXdJbWFnZSh0aGlzLmNhbnZhcy5uYXRpdmVFbGVtZW50LCAwLCAwKTtcbiAgICAgIGNvbnN0IGRhdGEgPSBjYW52YXMudG9EYXRhVVJMKCk7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG4gIH1cblxuICBzdG9wU3RyZWFtKCkge1xuICAgIGlmICh0aGlzLnN0cmVhbSkge1xuICAgICAgdGhpcy5zdHJlYW0uZ2V0VHJhY2tzKCkuZm9yRWFjaChcbiAgICAgICAgKHRyYWNrKSA9PiB7XG4gICAgICAgIHRyYWNrLnN0b3AoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICB0aGlzLnN0cmVhbSA9IG51bGw7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLnN0b3BTdHJlYW0oKTtcbiAgfVxuXG59XG4iXX0=