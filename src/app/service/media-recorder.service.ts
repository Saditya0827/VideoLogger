import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MediaRecorderService {

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
  chunk = [];
  updateViewOnStopRecording = new Subject<boolean>();
  passStreamToVideoElement = new Subject();

  constructor() { }

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
        this.passStreamToVideoElement.next(stream);

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
    this.updateViewOnStopRecording.next(true);
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

  videoBlobObjectUrl(){
    let videoBlobPreview: Blob;
    videoBlobPreview = new Blob(this.chunk);
    return window.URL.createObjectURL(videoBlobPreview);
  }

  resetChunk(){
    this.chunk = [];
  }
}
