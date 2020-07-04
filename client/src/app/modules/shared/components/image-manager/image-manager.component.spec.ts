import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MockComponent } from 'ng-mocks';
import { ImageCropperModule } from 'ngx-image-cropper';

// tslint:disable-next-line: max-line-length
import { CloseDialogButtonComponent } from '../close-dialog-button/close-dialog-button.component';
// tslint:disable-next-line: max-line-length
import { ImagePreviewComponent } from '../image-preview/image-preview.component';
import { LoaderComponent } from '../loader/loader.component';
import {
  ImageManagerComponent,
  ImageManagerData
} from './image-manager.component';

describe('ImageManagerComponent', () => {
  let component: ImageManagerComponent;
  let fixture: ComponentFixture<ImageManagerComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ImageManagerComponent>>;

  beforeEach(async(() => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      declarations: [
        ImageManagerComponent,
        MockComponent(ImagePreviewComponent),
        MockComponent(LoaderComponent),
        MockComponent(CloseDialogButtonComponent)
      ],
      imports: [ImageCropperModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            imageUrl: 'image.png',
            toLoadImage: true
          } as ImageManagerData
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
