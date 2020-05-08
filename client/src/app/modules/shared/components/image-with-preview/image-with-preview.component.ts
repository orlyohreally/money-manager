import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
// tslint:disable-next-line: max-line-length
import { ImageManagerComponent } from '../image-manager/image-manager.component';

@Component({
  selector: 'shared-image-with-preview',
  templateUrl: './image-with-preview.component.html',
  styleUrls: ['./image-with-preview.component.scss']
})
export class ImageWithPreviewComponent implements OnInit {
  @Input() imageUrl: string;
  @Output() selectedImage = new EventEmitter<string>();

  defaultImageUrl = '/assets/images/no-image.png';

  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  public showPreview() {
    const dialogRef = this.dialog.open(ImageManagerComponent, {
      width: '90%',
      height: '90%'
    });

    dialogRef.afterClosed().subscribe(newImageUrl => {
      if (newImageUrl && this.imageUrl !== newImageUrl) {
        this.selectedImage.emit(newImageUrl);
      }
    });
  }
}
