import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
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
  public loadedImage: string | ArrayBuffer;
  public croppedImage = '';
  public previewStyles: { [property: string]: string };
  public imageLoaded = false;

  public imageChangedEvent: Event;

  constructor(
    public dialogRef: MatDialogRef<ImageManagerComponent>,
    @Inject(MAT_DIALOG_DATA) public config: ImageManagerData
  ) {}

  ngOnInit() {}

  public onPreviewLoaded(event) {
    event.target.style['display'] = 'block';
    this.imageLoaded = true;
  }

  public saveChanges() {
    this.dialogRef.close(this.croppedImage);
  }

  public onFileChange(event: Event) {
    this.imageChangedEvent = event;
  }

  fileChangeEvent(): void {}

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  croppingLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }
}
