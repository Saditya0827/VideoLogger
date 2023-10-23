import { Component, ViewChild, ElementRef, NgZone, ComponentFactoryResolver, OnDestroy } from '@angular/core';
import { PreviewRecordingComponent } from '../preview-recording/preview-recording.component';
import { ComponentPlaceholderDirective } from '../../directive/component-placeholder.directive';
import { Subscription } from 'rxjs';
import { MediaRecorderService } from 'src/app/service/media-recorder.service';

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
  updateViewOnStopRecordingSubscription: Subscription;
  passStreamSubscription: Subscription;

  videoBlobObjectUrl: string;


  constructor(private zone: NgZone,
    private componentFactoryResolver: ComponentFactoryResolver,
    private mediaRecorderService: MediaRecorderService) { }

  ngOnDestroy(): void {
    if (this.previewCloseDialogSubscription) {
      this.previewCloseDialogSubscription.unsubscribe();
    }
    if (this.updateViewOnStopRecordingSubscription) {
      this.updateViewOnStopRecordingSubscription.unsubscribe();
    }
    if (this.passStreamSubscription) {
      this.passStreamSubscription.unsubscribe();
    }
  }

  onOpenCameraClick(event: Event) {
    this.mediaRecorderService.init();
    this.passStreamSubscription = this.mediaRecorderService.passStreamToVideoElement.subscribe( stream => {
      this.passStreamSubscription.unsubscribe();
      if(stream){
        this.videoElement.nativeElement.srcObject = stream;
      }
    });
    this.showPreWebcamTemplate = false;
    this.isRecordingBtnDisabled = false;
    this.isPreviewReordingBtnDisabled = true;
  }

  onRecordingClick(buttonText: string) {
    if (buttonText === "Start Recording") {
      this.recordingBtnText = "Stop Recording";
      this.mediaRecorderService.startRecording();
    } else {
      this.mediaRecorderService.stopRecording();

      this.updateViewOnStopRecordingSubscription = this.mediaRecorderService.updateViewOnStopRecording.subscribe( data => {
        this.updateViewOnStopRecordingSubscription.unsubscribe();
        if(data){
          this.zone.run(() => {
            this.isPreviewReordingBtnDisabled = false;
            this.isRecordingBtnDisabled = true;
            this.isResetBtnDisabled = false;
            this.isUploadBtnDisabled = false;
          });
        }
      });
    }
  }

  onPreviewClick(event: Event) {
    this.videoBlobObjectUrl = this.mediaRecorderService.videoBlobObjectUrl();

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
    this.mediaRecorderService.resetChunk();
  }

}
