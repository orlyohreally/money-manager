import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material';
import { MockComponent } from 'ng-mocks';

// tslint:disable-next-line: max-line-length
import { CloseDialogButtonComponent } from '@shared-client/components/close-dialog-button/close-dialog-button.component';
// tslint:disable-next-line: max-line-length
import { ContentWithLoaderComponent } from '@shared-client/components/content-with-loader/content-with-loader.component';
// tslint:disable-next-line: max-line-length
import { CurrencySelectorComponent } from '@shared-client/components/currency-selector/currency-selector.component';
// tslint:disable-next-line: max-line-length
import { ImageWithPreviewComponent } from '@shared-client/components/image-with-preview/image-with-preview.component';
import { FamilyFormComponent } from './family-form.component';

describe('FamilyFormComponent', () => {
  let component: FamilyFormComponent;
  let fixture: ComponentFixture<FamilyFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FamilyFormComponent,
        MockComponent(ImageWithPreviewComponent),
        MockComponent(CurrencySelectorComponent),
        MockComponent(ContentWithLoaderComponent),
        MockComponent(CloseDialogButtonComponent)
      ],
      imports: [ReactiveFormsModule, MatFormFieldModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
