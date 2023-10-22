import { Component, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-preview-recording',
  templateUrl: './preview-recording.component.html',
  styleUrls: ['./preview-recording.component.sass']
})
export class PreviewRecordingComponent {

  @Input() videoBlobUrl;
  @ViewChild("previewVideoRef") videoElement : ElementRef;
  @Output() closeDialog = new EventEmitter<boolean>();
  
  constructor(private sanitizer: DomSanitizer) { }

  getSanitizeUrl(){
    return this.sanitizer.bypassSecurityTrustUrl(this.videoBlobUrl);
  }

  onCloseBtnClick() {
    this.closeDialog.emit(true);
  }

  onDownloadBtnClick() {
    const link = document.createElement('a');
    link.href = this.videoBlobUrl;
    link.download = "video.webm";
    link.click();
  }

}
