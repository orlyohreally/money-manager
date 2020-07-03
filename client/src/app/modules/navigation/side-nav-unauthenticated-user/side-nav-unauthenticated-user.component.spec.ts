import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material/list';
import { RouterTestingModule } from '@angular/router/testing';

// tslint:disable-next-line: max-line-length
import { SideNavUnauthenticatedUserComponent } from './side-nav-unauthenticated-user.component';

describe('SideNavUnauthenticatedUserComponent', () => {
  let component: SideNavUnauthenticatedUserComponent;
  let fixture: ComponentFixture<SideNavUnauthenticatedUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SideNavUnauthenticatedUserComponent],
      imports: [MatListModule, RouterTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideNavUnauthenticatedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
