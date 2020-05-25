import { Component } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { BackgroundColorDirective } from './background-color.directive';

@Component({
  template: `
    <div class="content">
      <div
        class="mat-dialog-container"
        [style.backgroundColor]="'rgb(0, 0, 255)'"
        [style.height.px]="50"
        [style.width.px]="200"
      >
        <div
          class="wrapper"
          [style.backgroundColor]="'white'"
          [style.height.px]="40"
          [style.width.px]="150"
        >
          <div sharedBackgroundColor class="tested-element">Content</div>
        </div>
      </div>
    </div>
  `
})
class WithDialogComponent {}

@Component({
  template: `
    <div
      class="content"
      [style.backgroundColor]="'rgb(182, 152, 183)'"
      [style.height.px]="50"
      [style.width.px]="200"
    >
      <div
        class="wrapper"
        [style.backgroundColor]="'white'"
        [style.height.px]="40"
        [style.width.px]="150"
      >
        <div sharedBackgroundColor class="tested-element">Content</div>
      </div>
    </div>
  `
})
class WithoutDialogComponent {}

describe('BackgroundColorDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        BackgroundColorDirective,
        WithDialogComponent,
        WithoutDialogComponent
      ],
      providers: [{ provide: 'windowObj', useValue: window }]
    }).compileComponents();
  });

  it('should set elements color the same as color of dialog', fakeAsync(() => {
    const fixture = TestBed.createComponent(WithDialogComponent);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(
      getBackgroundColor(fixture.nativeElement.querySelector('.tested-element'))
    ).toEqual('rgb(0, 0, 255)');
  }));

  it('should set elements color the same as color of content', fakeAsync(() => {
    const fixture = TestBed.createComponent(WithoutDialogComponent);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(
      getBackgroundColor(fixture.nativeElement.querySelector('.tested-element'))
    ).toEqual('rgb(182, 152, 183)');
  }));

  function getBackgroundColor(el: Element): string {
    return window.getComputedStyle(el).backgroundColor;
  }
});
