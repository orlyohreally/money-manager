import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ImageCroppedEvent } from 'ngx-image-cropper';

export interface ImageManagerData {
  imageUrl: string;
  toLoadImage: boolean;
}

@Component({
  selector: 'app-image-loader',
  templateUrl: './image-manager.component.html',
  styleUrls: ['./image-manager.component.scss']
})
export class ImageManagerComponent implements OnInit {
  public loadedImage: string | ArrayBuffer;
  public croppedImage: string = '';
  public previewStyles: { [property: string]: string };
  public imageLoaded: boolean = false;

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
    console.log('loadedImage', this.loadedImage, this.croppedImage);
    this.dialogRef.close(this.croppedImage);
  }

  public onFileChange(event) {
    console.log(event);
    this.imageChangedEvent = event;
  }

  imageChangedEvent: Event;

  fileChangeEvent(event: any): void {}

  imageCropped(event: ImageCroppedEvent) {
    console.log('event.file', event.file);
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
