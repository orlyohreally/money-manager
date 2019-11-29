import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ImageManagerComponent } from '../image-manager/image-manager.component';
import { MatDialog } from '@angular/material';
import { ImagePreviewComponent } from '../image-preview/image-preview.component';

@Component({
  selector: 'shared-image-with-preview',
  templateUrl: './image-with-preview.component.html',
  styleUrls: ['./image-with-preview.component.scss']
})
export class ImageWithPreviewComponent implements OnInit {
  @Input() imageUrl: string;
  @Output() selectedImage = new EventEmitter<string>();

  defaultImageUrl = '/assets/images/family-icon.png';

  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  public showPreview() {
    console.log(this.imageUrl);
    const dialogRef = this.dialog.open(ImageManagerComponent, {
      width: '90%',
      height: '90%',
      data: { imageUrl: this.imageUrl, toLoadImage: true }
    });

    dialogRef.afterClosed().subscribe(newImageUrl => {
      if (newImageUrl && this.imageUrl !== newImageUrl) {
        this.selectedImage.emit(newImageUrl);
      }
    });
  }
}
