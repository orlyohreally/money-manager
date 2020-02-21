import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberRolesComponent } from './member-roles.component';

describe('MemberRolesComponent', () => {
  let component: MemberRolesComponent;
  let fixture: ComponentFixture<MemberRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MemberRolesComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
