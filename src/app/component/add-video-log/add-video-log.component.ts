import { Component, ViewChild, ElementRef, NgZone, ComponentFactoryResolver, OnDestroy } from '@angular/core';
import { PreviewRecordingComponent } from '../preview-recording/preview-recording.component';
import { ComponentPlaceholderDirective } from '../../directive/component-placeholder.directive';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-video-log',
  templateUrl: './add-video-log.component.html',
  styleUrls: ['./add-video-log.component.sass']
})
export class AddVideoLogComponent implements OnDestroy {

  @ViewChild("webCamVideoElement") videoElement: ElementRef;
  @ViewChild(ComponentPlaceholderDirective) componentPlaceholderDirective: ComponentPlaceholderDirective;

  isRecordingBtnDisabled: boolean = true;
  isPreviewReordingBtnDisabled: boolean = true;
  isUploadBtnDisabled: boolean = true;
  showPreWebcamTemplate: boolean = true;
  isResetBtnDisabled: boolean = true;
  recordingBtnText: string = "Start Recording";
  showPreviewDialogBox: boolean = false;
  previewCloseDialogSubscription: Subscription;

  mediaConfig = {
    audio: {
      echoCancellation: true
    },
    video: {
      width: 500,
      height: 350
    }
  };
  mediaRecorder;
  // declare var MediaRecorder: any;
  chunk = [];
  videoBlobObjectUrl: string;


  constructor(private zone: NgZone,
    private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnDestroy(): void {
    if (this.previewCloseDialogSubscription) {
      this.previewCloseDialogSubscription.unsubscribe();
    }
  }

  init() {
    let getMediaDevice = navigator?.mediaDevices;
    // let stream;
    let option = {
      mimeType: "video/webm"
    }

    if (!(getMediaDevice)) {
      console.log("Media device is not supported in this browser");
    } else {
      getMediaDevice.getUserMedia(this.mediaConfig).then((stream) => {
        this.videoElement.nativeElement.srcObject = stream;

        this.mediaRecorder = new MediaRecorder(stream, option);

        this.mediaRecorder.ondataavailable = (e) => this.getRecordingData(e);

        this.mediaRecorder.onstop = (e) => this.onMediaStopRecording(e);
      }).catch((error) => {
        console.log("error from init function", error.toString());
      });
    }
  }

  getRecordingData(e) {
    if (e.data?.size > 0) {
      this.chunk.push(e.data);
    }
  }

  onMediaStopRecording(e) {
    console.log("Recording Stopped");
    this.releaseMediaDevice();
    this.zone.run(() => {
      this.isPreviewReordingBtnDisabled = false;
      this.isRecordingBtnDisabled = true;
      this.isResetBtnDisabled = false;
      this.isUploadBtnDisabled = false;
    });

  }

  releaseMediaDevice() {
    let tracks = this.mediaRecorder?.stream?.getTracks() || [];
    if (tracks.length > 0) {
      tracks.forEach(track => {
        track?.stop();
      });
    }
  }


  startRecording() {
    this.mediaRecorder.start();
  }

  stopRecording() {
    this.mediaRecorder.stop();
  }


  onOpenCameraClick(event: Event) {
    this.init();
    this.showPreWebcamTemplate = false;
    this.isRecordingBtnDisabled = false;
    this.isPreviewReordingBtnDisabled = true;
  }

  onRecordingClick(buttonText: string) {
    if (buttonText === "Start Recording") {
      this.recordingBtnText = "Stop Recording";
      this.startRecording();
    } else {
      this.stopRecording();
    }
  }

  onPreviewClick(event: Event) {
    let videoBlobPreview: Blob;
    videoBlobPreview = new Blob(this.chunk);
    this.videoBlobObjectUrl = window.URL.createObjectURL(videoBlobPreview);

    //Dynamic component load
    const componentFactoryRef = this.componentFactoryResolver.resolveComponentFactory(PreviewRecordingComponent);
    const componentPlaceholderRef = this.componentPlaceholderDirective.viewContainerRef;
    componentPlaceholderRef.clear();

    const componentPreviewDialogRef = componentPlaceholderRef.createComponent(componentFactoryRef);
    componentPreviewDialogRef.instance.videoBlobUrl = this.videoBlobObjectUrl;

    this.previewCloseDialogSubscription = componentPreviewDialogRef.instance.closeDialog.subscribe(data => {
      this.previewCloseDialogSubscription.unsubscribe();
      componentPlaceholderRef.clear();
    });
  }

  onPreviewDialogClose(event: Event) {
    this.showPreviewDialogBox = !event;
  }

  onResetClick(event: Event) {
    this.isResetBtnDisabled = true;
    this.recordingBtnText = "Start Recording";
    this.isPreviewReordingBtnDisabled = true;
    this.isUploadBtnDisabled = true;
    this.isRecordingBtnDisabled = true;
    this.showPreWebcamTemplate = true;
    this.chunk = [];
  }

}
