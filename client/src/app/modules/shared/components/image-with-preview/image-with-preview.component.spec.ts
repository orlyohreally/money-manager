import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MockComponent } from 'ng-mocks';

import { DialogService } from '@core-client/services/dialog/dialog.service';
import { ImageComponent } from '../image/image.component';
import { ImageWithPreviewComponent } from './image-with-preview.component';

describe('ImageWithPreviewComponent', () => {
  let component: ImageWithPreviewComponent;
  let fixture: ComponentFixture<ImageWithPreviewComponent>;
  let dialogSpy: jasmine.SpyObj<DialogService>;

  beforeEach(async(() => {
    dialogSpy = jasmine.createSpyObj('DialogService', ['open']);

    TestBed.configureTestingModule({
      declarations: [ImageWithPreviewComponent, MockComponent(ImageComponent)],
      imports: [MatIconModule],
      providers: [{ provide: DialogService, useValue: dialogSpy }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageWithPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
