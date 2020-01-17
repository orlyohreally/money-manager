import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'shared-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.scss']
})
export class ImagePreviewComponent implements OnInit {
  @Input() imageUrl: string;

  imageLoaded: boolean = !this.imageUrl;

  constructor() {}

  ngOnInit() {}

  public onPreviewLoaded() {
    this.imageLoaded = true;
  }
}
