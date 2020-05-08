import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ImageCroppedEvent } from 'ngx-image-cropper';

export interface ImageManagerData {
  imageUrl: string;
  toLoadImage: boolean;
}

@Component({
  selector: 'shared-image-loader',
  templateUrl: './image-manager.component.html',
  styleUrls: ['./image-manager.component.scss']
})
export class ImageManagerComponent implements OnInit {
  croppedImage = '';
  imageChangedEvent: Event;
  hasLoadingError = false;
  cropperIsReady = true;

  constructor(public dialogRef: MatDialogRef<ImageManagerComponent>) {}

  ngOnInit() {}

  saveChanges() {
    this.dialogRef.close(this.croppedImage);
  }

  onFileChange(event: Event) {
    this.cropperIsReady = false;
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  cropperReady() {
    this.cropperIsReady = true;
  }

  loadImageFailed() {
    this.hasLoadingError = true;
    this.cropperIsReady = true;
  }
}
