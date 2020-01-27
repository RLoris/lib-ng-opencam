/**
 * @fileoverview added by tsickle
 * Generated from: lib/opencam.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ECaptureType, EStreamState, EMediaConstraints } from './opencam.models';
import { Observable } from 'rxjs';
var OpencamComponent = /** @class */ (function () {
    function OpencamComponent() {
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
    Object.defineProperty(OpencamComponent.prototype, "framerate", {
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            if (v > 0 && v <= 60) {
                this._framerate = Math.abs(v);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OpencamComponent.prototype, "videoSource", {
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            if (this.isScanCompleted) {
                if (v) {
                    this._videoSource = v;
                    this.stopStream();
                    this.initStream();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OpencamComponent.prototype, "audioSource", {
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            if (this.isScanCompleted) {
                this._audioSource = v;
                this.stopStream();
                this.initStream();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OpencamComponent.prototype, "width", {
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            if (v !== null) {
                this._width = v;
            }
            else {
                this.display = 'none';
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OpencamComponent.prototype, "height", {
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            if (v !== null) {
                this._height = v;
            }
            else {
                this.display = 'none';
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OpencamComponent.prototype, "capture", {
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            var _this = this;
            v.subscribe((/**
             * @param {?} c
             * @return {?}
             */
            function (c) {
                setTimeout((/**
                 * @return {?}
                 */
                function () {
                    if (_this.stream) {
                        if (_this._captureType === ECaptureType.VIDEO) {
                            if (!_this.isRecording) {
                                _this.startRecording();
                            }
                            else {
                                _this.stopRecording();
                            }
                        }
                        else {
                            /** @type {?} */
                            var img = _this.captureStreamShot();
                            if (img) {
                                _this.captureHandler(img);
                            }
                        }
                    }
                }), 1000 * Math.abs(c));
            }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OpencamComponent.prototype, "captureType", {
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            this._captureType = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OpencamComponent.prototype, "streamState", {
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OpencamComponent.prototype, "mediaConstraints", {
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OpencamComponent.prototype, "filters", {
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            this._filters = v;
            if (this.ctx) {
                this.ctx.filter = v;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    OpencamComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.ctx = this.canvas.nativeElement.getContext('2d');
        /** @type {?} */
        var sizeWidth = this.ctx.canvas.clientWidth;
        /** @type {?} */
        var sizeHeight = this.ctx.canvas.clientHeight;
        this.canvas.width = sizeWidth;
        this.canvas.height = sizeHeight;
        this.isScanCompleted = false;
        this.initOpenCam();
    };
    /**
     * @return {?}
     */
    OpencamComponent.prototype.initOpenCam = /**
     * @return {?}
     */
    function () {
        var _this = this;
        navigator.mediaDevices
            .ondevicechange = (/**
         * @param {?} e
         * @return {?}
         */
        function (e) { return _this.scanCaptureDevices(); });
        this.scanCaptureDevices();
    };
    /**
     * @return {?}
     */
    OpencamComponent.prototype.scanCaptureDevices = /**
     * @return {?}
     */
    function () {
        var _this = this;
        navigator.mediaDevices
            .enumerateDevices()
            .then((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { _this.handleCaptureDevices(d); /*this.initStream();*/ }))
            .catch((/**
         * @param {?} e
         * @return {?}
         */
        function (e) { return _this.errorHandler(e); }));
    };
    /**
     * @return {?}
     */
    OpencamComponent.prototype.sourceHandler = /**
     * @return {?}
     */
    function () {
        this.videoSourceEvent.emit(this.videoSources);
        this.audioSourceEvent.emit(this.audioSources);
    };
    /**
     * @param {?} c
     * @return {?}
     */
    OpencamComponent.prototype.captureHandler = /**
     * @param {?} c
     * @return {?}
     */
    function (c) {
        this.captureEvent.emit(c);
    };
    /**
     * @param {?} e
     * @return {?}
     */
    OpencamComponent.prototype.errorHandler = /**
     * @param {?} e
     * @return {?}
     */
    function (e) {
        this.errorEvent.emit(e);
    };
    /**
     * @private
     * @param {?} devicesInfos
     * @return {?}
     */
    OpencamComponent.prototype.handleCaptureDevices = /**
     * @private
     * @param {?} devicesInfos
     * @return {?}
     */
    function (devicesInfos) {
        /** @type {?} */
        var devicesFound = 0;
        this.videoSources = [];
        this.audioSources = [];
        // tslint:disable-next-line:prefer-for-of
        for (var i = 0; i < devicesInfos.length; i++) {
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
            var e = new Error();
            e.name = 'No devices available';
            e.message = 'Useful devices not found during scan';
            this.errorHandler(e);
        }
        else {
            // emit devices
            this.sourceHandler();
        }
        this.isScanCompleted = true;
    };
    /**
     * @private
     * @return {?}
     */
    OpencamComponent.prototype.initStream = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
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
            function (stream) {
                _this.video.addEventListener('loadedmetadata', (/**
                 * @return {?}
                 */
                function () {
                    _this.canvas.clientWidth = _this.video.videoWidth;
                    _this.canvas.clientHeight = _this.video.videoHeight;
                }));
                _this.video.addEventListener('play', (/**
                 * @return {?}
                 */
                function () { return _this.drawToCanvas(); }));
                _this.stream = stream;
                _this.video.srcObject = _this.stream;
                _this.video.muted = true;
                _this.video.controls = false;
                if (_this._streamState === EStreamState.PLAY) {
                    _this.video.play();
                }
            })).catch((/**
             * @param {?} error
             * @return {?}
             */
            function (error) {
                _this.errorHandler(error);
            }));
        }
        else {
            /** @type {?} */
            var e = new Error();
            e.name = 'Video stream init failed';
            e.message = 'No devices available for stream';
            this.errorHandler(e);
        }
    };
    /**
     * @return {?}
     */
    OpencamComponent.prototype.getAudioStream = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var audioCtx = new AudioContext();
        /** @type {?} */
        var source = audioCtx.createMediaStreamSource(this.stream);
        /** @type {?} */
        var destination = audioCtx.createMediaStreamDestination();
        source.connect(destination);
        source.connect(audioCtx.destination);
        /** @type {?} */
        var audioStream = destination.stream;
        return audioStream;
    };
    /**
     * @private
     * @return {?}
     */
    OpencamComponent.prototype.startRecording = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        this.isRecording = true;
        // frames recorded only on re-renders
        // @ts-ignore
        /** @type {?} */
        var videoStream = this.canvas.nativeElement.captureStream(this._framerate);
        // const audioStream = this.getAudioStream();
        /** @type {?} */
        var stream;
        if (this._audioSource) {
            stream = new MediaStream(tslib_1.__spread(this.stream.getAudioTracks(), videoStream.getTracks()));
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
        function (e) { return _this.extractRecording(e); });
        this.recorder.start();
    };
    /**
     * @param {?} e
     * @return {?}
     */
    OpencamComponent.prototype.extractRecording = /**
     * @param {?} e
     * @return {?}
     */
    function (e) {
        this.frames.push(e.data);
        /** @type {?} */
        var webmBlob = new Blob(this.frames, { type: 'video/webm' });
        /** @type {?} */
        var downloadUrl = URL.createObjectURL(webmBlob);
        this.captureHandler(downloadUrl);
        this.recorder = null;
    };
    /**
     * @private
     * @return {?}
     */
    OpencamComponent.prototype.stopRecording = /**
     * @private
     * @return {?}
     */
    function () {
        this.recorder.stop();
        this.isRecording = false;
    };
    /**
     * @private
     * @return {?}
     */
    OpencamComponent.prototype.drawToCanvas = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        this.ctx.drawImage(this.video, 0, 0);
        setTimeout((/**
         * @return {?}
         */
        function () { return _this.drawToCanvas(); }), (1000 / this._framerate));
    };
    /**
     * @private
     * @return {?}
     */
    OpencamComponent.prototype.captureStreamShot = /**
     * @private
     * @return {?}
     */
    function () {
        if (this.video) {
            /** @type {?} */
            var canvas = document.createElement('canvas');
            canvas.width = this.video.videoWidth;
            canvas.height = this.video.videoHeight;
            canvas.getContext('2d').drawImage(this.canvas.nativeElement, 0, 0);
            /** @type {?} */
            var data = canvas.toDataURL();
            return data;
        }
    };
    /**
     * @return {?}
     */
    OpencamComponent.prototype.stopStream = /**
     * @return {?}
     */
    function () {
        if (this.stream) {
            this.stream.getTracks().forEach((/**
             * @param {?} track
             * @return {?}
             */
            function (track) {
                track.stop();
            }));
        }
        this.stream = null;
        return true;
    };
    /**
     * @return {?}
     */
    OpencamComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.stopStream();
    };
    OpencamComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ng-opencam',
                    template: "<canvas [style.display]='this.display' #opencam [style.height]='this._height' [style.width]='this._width' [height]=\"this.video.videoHeight\" [width]=\"this.video.videoWidth\"></canvas>\n"
                }] }
    ];
    /** @nocollapse */
    OpencamComponent.ctorParameters = function () { return []; };
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
    return OpencamComponent;
}());
export { OpencamComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3BlbmNhbS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy1vcGVuY2FtLyIsInNvdXJjZXMiOlsibGliL29wZW5jYW0uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFhLE1BQU0sZUFBZSxDQUFDO0FBQ3JHLE9BQU8sRUFBaUIsWUFBWSxFQUFFLFlBQVksRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ2hHLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFbEM7SUFvTUU7UUE1TEEsaUJBQVksR0FBc0IsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFekQscUJBQWdCLEdBQWtDLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXpFLHFCQUFnQixHQUFrQyxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV6RSxlQUFVLEdBQXdCLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDOztRQVNqRCxlQUFVLEdBQUcsRUFBRSxDQUFDOztRQXVCaEIsaUJBQVksR0FBa0IsSUFBSSxDQUFDO1FBNEgzQyxVQUFLLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUtoQyxpQkFBWSxHQUFvQixFQUFFLENBQUM7UUFDbkMsaUJBQVksR0FBb0IsRUFBRSxDQUFDO1FBT25DLGdCQUFXLEdBQVE7WUFDekIsS0FBSyxFQUFFLEVBQUU7WUFDVCxLQUFLLEVBQUUsRUFBRTtTQUNWLENBQUM7SUFVYSxDQUFDO0lBcExoQixzQkFDSSx1Q0FBUzs7Ozs7UUFEYixVQUNjLENBQVM7WUFDckIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUU7Z0JBQ3BCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxD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O2dCQXZZRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLFlBQVk7b0JBQ3RCLHVNQUF1QztpQkFFeEM7Ozs7OytCQUdFLE1BQU07bUNBRU4sTUFBTTttQ0FFTixNQUFNOzZCQUVOLE1BQU07NEJBR04sS0FBSzs4QkFTTCxLQUFLOzhCQVlMLEtBQUs7d0JBV0wsS0FBSzt5QkFVTCxLQUFLOzBCQVVMLEtBQUs7OEJBdUJMLEtBQUs7OEJBTUwsS0FBSzttQ0FnQ0wsS0FBSzswQkErQkwsS0FBSzt5QkFXTCxTQUFTLFNBQUMsU0FBUyxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQzs7SUE4TnRDLHVCQUFDO0NBQUEsQUF6WUQsSUF5WUM7U0FwWVksZ0JBQWdCOzs7SUFFM0Isd0NBQ3lEOztJQUN6RCw0Q0FDeUU7O0lBQ3pFLDRDQUN5RTs7SUFDekUsc0NBQ3lEOzs7OztJQVN6RCxzQ0FBd0I7Ozs7O0lBYXhCLHdDQUFvQzs7Ozs7SUFVcEMsd0NBQTJDOztJQUMzQyxtQ0FBZ0I7O0lBVWhCLGtDQUFlOztJQVVmLG1DQUFnQjs7Ozs7SUF1QmhCLG9DQUFxQzs7Ozs7SUFNckMsd0NBQW1DOzs7OztJQWdDbkMsd0NBQW1DOzs7OztJQStCbkMsNkNBQTZDOzs7OztJQVM3QyxvQ0FBeUI7O0lBRXpCLGlDQUF3Qzs7SUFDeEMsa0NBQ087O0lBQ1AsK0JBQThCOzs7OztJQUU5Qix3Q0FBMkM7Ozs7O0lBQzNDLHdDQUEyQzs7Ozs7SUFFM0MsOENBQTBDOzs7OztJQUMxQyw4Q0FBMEM7Ozs7O0lBRTFDLGlDQUFjOzs7OztJQUNkLGtDQUFlOzs7OztJQUNmLHVDQUdFOztJQUVGLDJDQUF5Qjs7SUFDekIsOENBQTRCOztJQUM1Qix1Q0FBcUI7O0lBQ3JCLDJDQUF5Qjs7SUFDekIsb0NBQVM7O0lBRVQsa0NBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgVmlld0NoaWxkLCBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IElTb3VyY2VEZXZpY2UsIEVDYXB0dXJlVHlwZSwgRVN0cmVhbVN0YXRlLCBFTWVkaWFDb25zdHJhaW50cyB9IGZyb20gJy4vb3BlbmNhbS5tb2RlbHMnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZy1vcGVuY2FtJyxcbiAgdGVtcGxhdGVVcmw6ICcuL29wZW5jYW0uY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZXM6IFtdXG59KVxuZXhwb3J0IGNsYXNzIE9wZW5jYW1Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG5cbiAgQE91dHB1dCgpXG4gIGNhcHR1cmVFdmVudDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKHRydWUpO1xuICBAT3V0cHV0KClcbiAgdmlkZW9Tb3VyY2VFdmVudDogRXZlbnRFbWl0dGVyPElTb3VyY2VEZXZpY2VbXT4gPSBuZXcgRXZlbnRFbWl0dGVyKHRydWUpO1xuICBAT3V0cHV0KClcbiAgYXVkaW9Tb3VyY2VFdmVudDogRXZlbnRFbWl0dGVyPElTb3VyY2VEZXZpY2VbXT4gPSBuZXcgRXZlbnRFbWl0dGVyKHRydWUpO1xuICBAT3V0cHV0KClcbiAgZXJyb3JFdmVudDogRXZlbnRFbWl0dGVyPEVycm9yPiA9IG5ldyBFdmVudEVtaXR0ZXIodHJ1ZSk7XG5cbiAgQElucHV0KClcbiAgc2V0IGZyYW1lcmF0ZSh2OiBudW1iZXIpIHtcbiAgICBpZiAodiA+IDAgJiYgdiA8PSA2MCkge1xuICAgICAgdGhpcy5fZnJhbWVyYXRlID0gTWF0aC5hYnModik7XG4gICAgfVxuICB9XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lXG4gIHByaXZhdGUgX2ZyYW1lcmF0ZSA9IDMwO1xuXG4gIEBJbnB1dCgpXG4gIHNldCB2aWRlb1NvdXJjZSh2OiBJU291cmNlRGV2aWNlKSB7XG4gICAgaWYgKHRoaXMuaXNTY2FuQ29tcGxldGVkKSB7XG4gICAgICBpZiAodikge1xuICAgICAgICB0aGlzLl92aWRlb1NvdXJjZSA9IHY7XG4gICAgICAgIHRoaXMuc3RvcFN0cmVhbSgpO1xuICAgICAgICB0aGlzLmluaXRTdHJlYW0oKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWVcbiAgcHJpdmF0ZSBfdmlkZW9Tb3VyY2U6IElTb3VyY2VEZXZpY2U7XG4gIEBJbnB1dCgpXG4gIHNldCBhdWRpb1NvdXJjZSh2OiBJU291cmNlRGV2aWNlKSB7XG4gICAgaWYgKHRoaXMuaXNTY2FuQ29tcGxldGVkKSB7XG4gICAgICB0aGlzLl9hdWRpb1NvdXJjZSA9IHY7XG4gICAgICB0aGlzLnN0b3BTdHJlYW0oKTtcbiAgICAgIHRoaXMuaW5pdFN0cmVhbSgpO1xuICAgIH1cbiAgfVxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZVxuICBwcml2YXRlIF9hdWRpb1NvdXJjZTogSVNvdXJjZURldmljZSA9IG51bGw7XG4gIGRpc3BsYXk6IHN0cmluZztcbiAgQElucHV0KClcbiAgc2V0IHdpZHRoKHY6IHN0cmluZykge1xuICAgIGlmICh2ICE9PSBudWxsKSB7XG4gICAgICB0aGlzLl93aWR0aCA9IHY7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGlzcGxheSA9ICdub25lJztcbiAgICB9XG4gIH1cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWVcbiAgX3dpZHRoOiBzdHJpbmc7XG4gIEBJbnB1dCgpXG4gIHNldCBoZWlnaHQodjogc3RyaW5nKSB7XG4gICAgaWYgKHYgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuX2hlaWdodCA9IHY7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGlzcGxheSA9ICdub25lJztcbiAgICB9XG4gIH1cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWVcbiAgX2hlaWdodDogc3RyaW5nO1xuICBASW5wdXQoKVxuICBzZXQgY2FwdHVyZSh2OiBPYnNlcnZhYmxlPG51bWJlcj4pIHtcbiAgICB2LnN1YnNjcmliZShcbiAgICAgIChjKSA9PiB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLnN0cmVhbSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2NhcHR1cmVUeXBlID09PSBFQ2FwdHVyZVR5cGUuVklERU8pIHtcbiAgICAgICAgICAgICAgaWYgKCF0aGlzLmlzUmVjb3JkaW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydFJlY29yZGluZygpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RvcFJlY29yZGluZygpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb25zdCBpbWcgPSB0aGlzLmNhcHR1cmVTdHJlYW1TaG90KCk7XG4gICAgICAgICAgICAgIGlmIChpbWcpIHsgdGhpcy5jYXB0dXJlSGFuZGxlcihpbWcpOyB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LCAxMDAwICogTWF0aC5hYnMoYykpO1xuICAgICAgfVxuICAgICk7XG4gIH1cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWVcbiAgcHJpdmF0ZSBfY2FwdHVyZTogT2JzZXJ2YWJsZTxudW1iZXI+O1xuICBASW5wdXQoKVxuICBzZXQgY2FwdHVyZVR5cGUodjogRUNhcHR1cmVUeXBlKSB7XG4gICAgdGhpcy5fY2FwdHVyZVR5cGUgPSB2O1xuICB9XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lXG4gIHByaXZhdGUgX2NhcHR1cmVUeXBlOiBFQ2FwdHVyZVR5cGU7XG4gIEBJbnB1dCgpXG4gIHNldCBzdHJlYW1TdGF0ZSh2OiBFU3RyZWFtU3RhdGUpIHtcbiAgICBpZiAodikge1xuICAgICAgdGhpcy5fc3RyZWFtU3RhdGUgPSB2O1xuICAgICAgaWYgKHRoaXMuc3RyZWFtICE9PSB1bmRlZmluZWQgJiYgdGhpcy5zdHJlYW0gIT09IG51bGwpIHtcbiAgICAgICAgaWYgKHYgPT09IEVTdHJlYW1TdGF0ZS5QTEFZKSB7XG4gICAgICAgICAgdGhpcy52aWRlby5wbGF5KCk7XG4gICAgICAgICAgaWYgKHRoaXMucmVjb3JkZXIpIHtcbiAgICAgICAgICAgIHRoaXMucmVjb3JkZXIucmVzdW1lKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHYgPT09IEVTdHJlYW1TdGF0ZS5QQVVTRSkge1xuICAgICAgICAgIHRoaXMudmlkZW8ucGF1c2UoKTtcbiAgICAgICAgICBpZiAodGhpcy5yZWNvcmRlcikge1xuICAgICAgICAgICAgdGhpcy5yZWNvcmRlci5wYXVzZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh2ID09PSBFU3RyZWFtU3RhdGUuU1RPUCkge1xuICAgICAgICAgIHRoaXMudmlkZW8ucGF1c2UoKTtcbiAgICAgICAgICBpZiAodGhpcy5yZWNvcmRlcikge1xuICAgICAgICAgICAgdGhpcy5yZWNvcmRlci5zdG9wKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuc3RvcFN0cmVhbSgpO1xuICAgICAgICAgIHRoaXMudmlkZW8uc3JjT2JqZWN0ID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHYgPT09IEVTdHJlYW1TdGF0ZS5QTEFZICYmIHRoaXMudmlkZW9Tb3VyY2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aGlzLmluaXRTdHJlYW0oKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZVxuICBwcml2YXRlIF9zdHJlYW1TdGF0ZTogRVN0cmVhbVN0YXRlO1xuICBASW5wdXQoKVxuICBzZXQgbWVkaWFDb25zdHJhaW50cyh2OiBFTWVkaWFDb25zdHJhaW50cykge1xuICAgIGlmICh2KSB7XG4gICAgICB0aGlzLl9tZWRpYUNvbnN0cmFpbnRzID0gdjtcbiAgICAgIGlmICh2ID09PSBFTWVkaWFDb25zdHJhaW50cy5IRCkge1xuICAgICAgICB0aGlzLmNvbnN0cmFpbnRzLnZpZGVvLndpZHRoID0ge21pbjogMTI4MH07XG4gICAgICAgIHRoaXMuY29uc3RyYWludHMudmlkZW8uaGVpZ2h0ID0ge21pbjogNzIwfTtcbiAgICAgIH0gZWxzZSBpZiAodiA9PT0gRU1lZGlhQ29uc3RyYWludHMuRkhEKSB7XG4gICAgICAgIHRoaXMuY29uc3RyYWludHMudmlkZW8ud2lkdGggPSB7bWluOiAxOTIwfTtcbiAgICAgICAgdGhpcy5jb25zdHJhaW50cy52aWRlby5oZWlnaHQgPSB7bWluOiAxMDgwfTtcbiAgICAgIH0gZWxzZSBpZiAodiA9PT0gRU1lZGlhQ29uc3RyYWludHMuVkdBKSB7XG4gICAgICAgIHRoaXMuY29uc3RyYWludHMudmlkZW8ud2lkdGggPSB7bWluOiA2NDB9O1xuICAgICAgICB0aGlzLmNvbnN0cmFpbnRzLnZpZGVvLmhlaWdodCA9IHttaW46IDQ4MH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5jb25zdHJhaW50cyAmJiB0aGlzLmNvbnN0cmFpbnRzLnZpZGVvKSB7XG4gICAgICAgICAgaWYgKHRoaXMuY29uc3RyYWludHMudmlkZW8ud2lkdGgpIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmNvbnN0cmFpbnRzLnZpZGVvLndpZHRoO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodGhpcy5jb25zdHJhaW50cy52aWRlby5oZWlnaHQpIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmNvbnN0cmFpbnRzLnZpZGVvLmhlaWdodDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuc3RyZWFtICYmIHRoaXMuc3RvcFN0cmVhbSgpKSB7XG4gICAgICAgIHRoaXMuaW5pdFN0cmVhbSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZVxuICBwcml2YXRlIF9tZWRpYUNvbnN0cmFpbnRzOiBFTWVkaWFDb25zdHJhaW50cztcbiAgQElucHV0KClcbiAgc2V0IGZpbHRlcnModjogc3RyaW5nKSB7XG4gICAgdGhpcy5fZmlsdGVycyA9IHY7XG4gICAgaWYgKHRoaXMuY3R4KSB7XG4gICAgICB0aGlzLmN0eC5maWx0ZXIgPSB2O1xuICAgIH1cbiAgfVxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZVxuICBwcml2YXRlIF9maWx0ZXJzOiBzdHJpbmc7XG5cbiAgdmlkZW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd2aWRlbycpO1xuICBAVmlld0NoaWxkKCdvcGVuY2FtJywge3N0YXRpYzogdHJ1ZX0pXG4gIGNhbnZhcztcbiAgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG5cbiAgcHJpdmF0ZSB2aWRlb1NvdXJjZXM6IElTb3VyY2VEZXZpY2VbXSA9IFtdO1xuICBwcml2YXRlIGF1ZGlvU291cmNlczogSVNvdXJjZURldmljZVtdID0gW107XG5cbiAgcHJpdmF0ZSBjdXJyZW50VmlkZW9Tb3VyY2U6IElTb3VyY2VEZXZpY2U7XG4gIHByaXZhdGUgY3VycmVudEF1ZGlvU291cmNlOiBJU291cmNlRGV2aWNlO1xuXG4gIHByaXZhdGUgcmFmSWQ7XG4gIHByaXZhdGUgc3RyZWFtO1xuICBwcml2YXRlIGNvbnN0cmFpbnRzOiBhbnkgPSB7XG4gICAgYXVkaW86IHt9LFxuICAgIHZpZGVvOiB7fVxuICB9O1xuXG4gIGlzU3RyZWFtTG9hZGluZzogYm9vbGVhbjtcbiAgaXNTdHJlYW1JblByb2dyZXNzOiBib29sZWFuO1xuICBpc1JlY29yZGluZzogYm9vbGVhbjtcbiAgaXNTY2FuQ29tcGxldGVkOiBib29sZWFuO1xuICByZWNvcmRlcjtcblxuICBmcmFtZXM6IHN0cmluZ1tdO1xuXG4gIGNvbnN0cnVjdG9yKCkge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmN0eCA9IHRoaXMuY2FudmFzLm5hdGl2ZUVsZW1lbnQuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBjb25zdCBzaXplV2lkdGggPSB0aGlzLmN0eC5jYW52YXMuY2xpZW50V2lkdGg7XG4gICAgY29uc3Qgc2l6ZUhlaWdodCA9IHRoaXMuY3R4LmNhbnZhcy5jbGllbnRIZWlnaHQ7XG4gICAgdGhpcy5jYW52YXMud2lkdGggPSBzaXplV2lkdGg7XG4gICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gc2l6ZUhlaWdodDtcbiAgICB0aGlzLmlzU2NhbkNvbXBsZXRlZCA9IGZhbHNlO1xuICAgIHRoaXMuaW5pdE9wZW5DYW0oKTtcbiAgfVxuXG4gIGluaXRPcGVuQ2FtKCkge1xuICAgIG5hdmlnYXRvci5tZWRpYURldmljZXNcbiAgICAgIC5vbmRldmljZWNoYW5nZSA9IChlKSA9PiB0aGlzLnNjYW5DYXB0dXJlRGV2aWNlcygpO1xuICAgIHRoaXMuc2NhbkNhcHR1cmVEZXZpY2VzKCk7XG4gIH1cblxuICBzY2FuQ2FwdHVyZURldmljZXMoKSB7XG4gICAgbmF2aWdhdG9yLm1lZGlhRGV2aWNlc1xuICAgICAgLmVudW1lcmF0ZURldmljZXMoKVxuICAgICAgLnRoZW4oKGQ6IE1lZGlhRGV2aWNlSW5mb1tdKSA9PiB7IHRoaXMuaGFuZGxlQ2FwdHVyZURldmljZXMoZCk7IC8qdGhpcy5pbml0U3RyZWFtKCk7Ki8gfSlcbiAgICAgIC5jYXRjaCgoZSkgPT4gdGhpcy5lcnJvckhhbmRsZXIoZSkpO1xuICB9XG5cbiAgc291cmNlSGFuZGxlcigpIHtcbiAgICB0aGlzLnZpZGVvU291cmNlRXZlbnQuZW1pdCh0aGlzLnZpZGVvU291cmNlcyk7XG4gICAgdGhpcy5hdWRpb1NvdXJjZUV2ZW50LmVtaXQodGhpcy5hdWRpb1NvdXJjZXMpO1xuICB9XG5cbiAgY2FwdHVyZUhhbmRsZXIoYykge1xuICAgIHRoaXMuY2FwdHVyZUV2ZW50LmVtaXQoYyk7XG4gIH1cblxuICBlcnJvckhhbmRsZXIoZSkge1xuICAgIHRoaXMuZXJyb3JFdmVudC5lbWl0KGUpO1xuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVDYXB0dXJlRGV2aWNlcyhkZXZpY2VzSW5mb3M6IE1lZGlhRGV2aWNlSW5mb1tdKSB7XG4gICAgICBsZXQgZGV2aWNlc0ZvdW5kID0gMDtcbiAgICAgIHRoaXMudmlkZW9Tb3VyY2VzID0gW107XG4gICAgICB0aGlzLmF1ZGlvU291cmNlcyA9IFtdO1xuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6cHJlZmVyLWZvci1vZlxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkZXZpY2VzSW5mb3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChkZXZpY2VzSW5mb3NbaV0ua2luZCA9PT0gJ3ZpZGVvaW5wdXQnKSB7XG4gICAgICAgICAgICAgIGlmKGRldmljZXNJbmZvc1tpXS5kZXZpY2VJZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgZGV2aWNlc0ZvdW5kKys7XG4gICAgICAgICAgICAgICAgdGhpcy52aWRlb1NvdXJjZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICBpZDogZGV2aWNlc0luZm9zW2ldLmRldmljZUlkLFxuICAgICAgICAgICAgICAgICAgbGFiZWw6IGRldmljZXNJbmZvc1tpXS5sYWJlbCxcbiAgICAgICAgICAgICAgICAgIGtpbmQ6IGRldmljZXNJbmZvc1tpXS5raW5kLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZGV2aWNlc0luZm9zW2ldLmtpbmQgPT09ICdhdWRpb2lucHV0Jykge1xuICAgICAgICAgICAgICBpZihkZXZpY2VzSW5mb3NbaV0uZGV2aWNlSWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuYXVkaW9Tb3VyY2VzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgaWQ6IGRldmljZXNJbmZvc1tpXS5kZXZpY2VJZCxcbiAgICAgICAgICAgICAgICAgIGxhYmVsOiBkZXZpY2VzSW5mb3NbaV0ubGFiZWwsXG4gICAgICAgICAgICAgICAgICBraW5kOiBkZXZpY2VzSW5mb3NbaV0ua2luZCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGRldmljZXNGb3VuZCA9PT0gMCkge1xuICAgICAgICBjb25zdCBlID0gbmV3IEVycm9yKCk7XG4gICAgICAgIGUubmFtZSA9ICdObyBkZXZpY2VzIGF2YWlsYWJsZSc7XG4gICAgICAgIGUubWVzc2FnZSA9ICdVc2VmdWwgZGV2aWNlcyBub3QgZm91bmQgZHVyaW5nIHNjYW4nO1xuICAgICAgICB0aGlzLmVycm9ySGFuZGxlcihlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGVtaXQgZGV2aWNlc1xuICAgICAgICB0aGlzLnNvdXJjZUhhbmRsZXIoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuaXNTY2FuQ29tcGxldGVkID0gdHJ1ZTtcbiAgfVxuXG4gIHByaXZhdGUgaW5pdFN0cmVhbSgpIHtcbiAgICBpZiAodGhpcy52aWRlb1NvdXJjZXMubGVuZ3RoID4gMCkge1xuXG4gICAgICBpZiAoIXRoaXMuX3ZpZGVvU291cmNlKSB7XG4gICAgICAgIHRoaXMuY3VycmVudFZpZGVvU291cmNlID0gdGhpcy52aWRlb1NvdXJjZXNbMF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmN1cnJlbnRWaWRlb1NvdXJjZSA9IHRoaXMuX3ZpZGVvU291cmNlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuX2F1ZGlvU291cmNlKSB7XG4gICAgICAgIHRoaXMuY3VycmVudEF1ZGlvU291cmNlID0gbnVsbDtcbiAgICAgICAgdGhpcy5jb25zdHJhaW50cy5hdWRpbyA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jdXJyZW50QXVkaW9Tb3VyY2UgPSB0aGlzLl9hdWRpb1NvdXJjZSBhcyBJU291cmNlRGV2aWNlO1xuICAgICAgICB0aGlzLmNvbnN0cmFpbnRzLmF1ZGlvID0geyBkZXZpY2VJZDogeyBleGFjdDogdGhpcy5jdXJyZW50QXVkaW9Tb3VyY2UuaWQgfX07XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY29uc3RyYWludHMudmlkZW8uZGV2aWNlSWQgPSB7IGV4YWN0OiB0aGlzLmN1cnJlbnRWaWRlb1NvdXJjZS5pZCB9O1xuXG4gICAgICBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYSh0aGlzLmNvbnN0cmFpbnRzKVxuICAgICAgLnRoZW4oIChzdHJlYW0pID0+IHtcbiAgICAgICAgICAgIHRoaXMudmlkZW8uYWRkRXZlbnRMaXN0ZW5lcignbG9hZGVkbWV0YWRhdGEnLCAoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuY2FudmFzLmNsaWVudFdpZHRoID0gdGhpcy52aWRlby52aWRlb1dpZHRoO1xuICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5jbGllbnRIZWlnaHQgPSB0aGlzLnZpZGVvLnZpZGVvSGVpZ2h0O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ3BsYXknLCAoKSA9PiB0aGlzLmRyYXdUb0NhbnZhcygpKTtcbiAgICAgICAgICAgIHRoaXMuc3RyZWFtID0gc3RyZWFtO1xuICAgICAgICAgICAgdGhpcy52aWRlby5zcmNPYmplY3QgPSB0aGlzLnN0cmVhbTtcbiAgICAgICAgICAgIHRoaXMudmlkZW8ubXV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy52aWRlby5jb250cm9scyA9IGZhbHNlO1xuICAgICAgICAgICAgaWYodGhpcy5fc3RyZWFtU3RhdGUgPT09IEVTdHJlYW1TdGF0ZS5QTEFZKSB7XG4gICAgICAgICAgICAgIHRoaXMudmlkZW8ucGxheSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS5jYXRjaCggKGVycm9yKSA9PiB7XG4gICAgICAgICAgdGhpcy5lcnJvckhhbmRsZXIoZXJyb3IpO1xuICAgICAgICB9KTtcblxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBlID0gbmV3IEVycm9yKCk7XG4gICAgICBlLm5hbWUgPSAnVmlkZW8gc3RyZWFtIGluaXQgZmFpbGVkJztcbiAgICAgIGUubWVzc2FnZSA9ICdObyBkZXZpY2VzIGF2YWlsYWJsZSBmb3Igc3RyZWFtJztcbiAgICAgIHRoaXMuZXJyb3JIYW5kbGVyKGUpO1xuICAgIH1cbiAgfVxuXG4gIGdldEF1ZGlvU3RyZWFtKCkge1xuICAgIGNvbnN0IGF1ZGlvQ3R4ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xuICAgIGNvbnN0IHNvdXJjZSA9IGF1ZGlvQ3R4LmNyZWF0ZU1lZGlhU3RyZWFtU291cmNlKHRoaXMuc3RyZWFtKTtcbiAgICBjb25zdCBkZXN0aW5hdGlvbiA9IGF1ZGlvQ3R4LmNyZWF0ZU1lZGlhU3RyZWFtRGVzdGluYXRpb24oKTtcbiAgICBzb3VyY2UuY29ubmVjdChkZXN0aW5hdGlvbik7XG4gICAgc291cmNlLmNvbm5lY3QoYXVkaW9DdHguZGVzdGluYXRpb24pO1xuICAgIGNvbnN0IGF1ZGlvU3RyZWFtID0gZGVzdGluYXRpb24uc3RyZWFtO1xuICAgIHJldHVybiBhdWRpb1N0cmVhbTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhcnRSZWNvcmRpbmcoKSB7XG4gICAgdGhpcy5pc1JlY29yZGluZyA9IHRydWU7XG4gICAgLy8gZnJhbWVzIHJlY29yZGVkIG9ubHkgb24gcmUtcmVuZGVyc1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zdCB2aWRlb1N0cmVhbSA9IHRoaXMuY2FudmFzLm5hdGl2ZUVsZW1lbnQuY2FwdHVyZVN0cmVhbSh0aGlzLl9mcmFtZXJhdGUpO1xuICAgIC8vIGNvbnN0IGF1ZGlvU3RyZWFtID0gdGhpcy5nZXRBdWRpb1N0cmVhbSgpO1xuICAgIGxldCBzdHJlYW07XG4gICAgaWYgKHRoaXMuX2F1ZGlvU291cmNlKSB7XG4gICAgICBzdHJlYW0gPSBuZXcgTWVkaWFTdHJlYW0oW1xuICAgICAgICAuLi50aGlzLnN0cmVhbS5nZXRBdWRpb1RyYWNrcygpLFxuICAgICAgICAuLi52aWRlb1N0cmVhbS5nZXRUcmFja3MoKVxuICAgICAgXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0cmVhbSA9IHZpZGVvU3RyZWFtO1xuICAgIH1cbiAgICAvLyBAdHMtaWdub3JlXG4gICAgdGhpcy5yZWNvcmRlciA9IG5ldyBNZWRpYVJlY29yZGVyKHN0cmVhbSk7XG4gICAgdGhpcy5mcmFtZXMgPSBbXTtcbiAgICB0aGlzLnJlY29yZGVyLm9uZGF0YWF2YWlsYWJsZSA9IChlKSA9PiB0aGlzLmV4dHJhY3RSZWNvcmRpbmcoZSk7XG4gICAgdGhpcy5yZWNvcmRlci5zdGFydCgpO1xuICB9XG5cbiAgZXh0cmFjdFJlY29yZGluZyhlKSB7XG4gICAgdGhpcy5mcmFtZXMucHVzaChlLmRhdGEpO1xuICAgIGNvbnN0IHdlYm1CbG9iID0gbmV3IEJsb2IodGhpcy5mcmFtZXMsIHsgdHlwZTogJ3ZpZGVvL3dlYm0nIH0pO1xuICAgIGNvbnN0IGRvd25sb2FkVXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTCh3ZWJtQmxvYik7XG4gICAgdGhpcy5jYXB0dXJlSGFuZGxlcihkb3dubG9hZFVybCk7XG4gICAgdGhpcy5yZWNvcmRlciA9IG51bGw7XG4gIH1cblxuICBwcml2YXRlIHN0b3BSZWNvcmRpbmcoKSB7XG4gICAgdGhpcy5yZWNvcmRlci5zdG9wKCk7XG4gICAgdGhpcy5pc1JlY29yZGluZyA9IGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBkcmF3VG9DYW52YXMoKSB7XG4gICAgdGhpcy5jdHguZHJhd0ltYWdlKHRoaXMudmlkZW8sIDAsIDApO1xuICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5kcmF3VG9DYW52YXMoKSwgKDEwMDAgLyB0aGlzLl9mcmFtZXJhdGUpKTtcbiAgfVxuXG4gIHByaXZhdGUgY2FwdHVyZVN0cmVhbVNob3QoKSB7XG4gICAgaWYgKHRoaXMudmlkZW8pIHtcbiAgICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgY2FudmFzLndpZHRoID0gdGhpcy52aWRlby52aWRlb1dpZHRoO1xuICAgICAgY2FudmFzLmhlaWdodCA9IHRoaXMudmlkZW8udmlkZW9IZWlnaHQ7XG4gICAgICBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKS5kcmF3SW1hZ2UodGhpcy5jYW52YXMubmF0aXZlRWxlbWVudCwgMCwgMCk7XG4gICAgICBjb25zdCBkYXRhID0gY2FudmFzLnRvRGF0YVVSTCgpO1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuICB9XG5cbiAgc3RvcFN0cmVhbSgpIHtcbiAgICBpZiAodGhpcy5zdHJlYW0pIHtcbiAgICAgIHRoaXMuc3RyZWFtLmdldFRyYWNrcygpLmZvckVhY2goXG4gICAgICAgICh0cmFjaykgPT4ge1xuICAgICAgICB0cmFjay5zdG9wKCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgdGhpcy5zdHJlYW0gPSBudWxsO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5zdG9wU3RyZWFtKCk7XG4gIH1cblxufVxuIl19