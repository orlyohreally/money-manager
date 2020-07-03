import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockComponent } from 'ng-mocks';

// tslint:disable-next-line: max-line-length
import { ContentWithLoaderComponent } from '@shared-client/components/content-with-loader/content-with-loader.component';
// tslint:disable-next-line: max-line-length
import { CurrencySelectorComponent } from '@shared-client/components/currency-selector/currency-selector.component';
// tslint:disable-next-line: max-line-length
import { ImageWithPreviewComponent } from '@shared-client/components/image-with-preview/image-with-preview.component';
import { User } from '@shared/types';
import { UserFormComponent } from './user-form.component';

@Component({
  template: `
    <user-form
      [user]="user"
      [errorMessage]="errorMessage"
      [submittingForm]="submittingForm"
    ></user-form>
  `
})
class ParentComponent {
  user: User;
  errorMessage: string;
  submittingForm: string;

  @ViewChild(UserFormComponent) userFormComponent: UserFormComponent;
}

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let parentComponent: ParentComponent;
  let fixture: ComponentFixture<ParentComponent>;

  const mockedUser: User = {
    _id: '_id',
    firstName: 'firstName-1',
    lastName: 'astName-1',
    email: 'email-1@gmail.com'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UserFormComponent,
        ParentComponent,
        MockComponent(CurrencySelectorComponent),
        MockComponent(ImageWithPreviewComponent),
        MockComponent(ContentWithLoaderComponent)
      ],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentComponent);
    parentComponent = fixture.componentInstance;
    parentComponent.user = { ...mockedUser };
    fixture.detectChanges();
    component = parentComponent.userFormComponent;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
