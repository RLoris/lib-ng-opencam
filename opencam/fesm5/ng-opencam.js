import { __spread } from 'tslib';
import 'rxjs';
import { Injectable, NgModule, ɵɵdefineInjectable, EventEmitter, Component, Output, Input, ViewChild } from '@angular/core';

/**
 * @fileoverview added by tsickle
 * Generated from: lib/opencam.service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var OpencamService = /** @class */ (function () {
    function OpencamService() {
    }
    OpencamService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    /** @nocollapse */
    OpencamService.ctorParameters = function () { return []; };
    /** @nocollapse */ OpencamService.ngInjectableDef = ɵɵdefineInjectable({ factory: function OpencamService_Factory() { return new OpencamService(); }, token: OpencamService, providedIn: "root" });
    return OpencamService;
}());

/**
 * @fileoverview added by tsickle
 * Generated from: lib/opencam.models.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {string} */
var ECaptureType = {
    VIDEO: "video",
    PICTURE: "picture",
};
/** @enum {string} */
var EStreamState = {
    PLAY: "play",
    PAUSE: "pause",
    STOP: "stop",
};
/** @enum {string} */
var EMediaConstraints = {
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
            stream = new MediaStream(__spread(this.stream.getAudioTracks(), videoStream.getTracks()));
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

/**
 * @fileoverview added by tsickle
 * Generated from: lib/opencam.module.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var OpencamModule = /** @class */ (function () {
    function OpencamModule() {
    }
    OpencamModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [OpencamComponent],
                    imports: [],
                    exports: [OpencamComponent]
                },] }
    ];
    return OpencamModule;
}());

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