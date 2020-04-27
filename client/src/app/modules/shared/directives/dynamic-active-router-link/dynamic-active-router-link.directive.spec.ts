import { Component, Renderer2, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationEnd, Router } from '@angular/router';
import { getTestScheduler, hot } from 'jasmine-marbles';
// tslint:disable-next-line: max-line-length
import { DynamicActiveRouterLinkDirective } from './dynamic-active-router-link.directive';

@Component({
  template: `
    <div
      class="dynamic-link"
      [sharedDynamicActiveRouterLink]="class"
      [linkInstructions]="instructions"
      [linkExactMatch]="linkExactMatch"
    >
      Test
    </div>
  `
})
class TestDynamicLinkActiveDirectiveComponent {
  instructions: any[];
  class: string;
  linkExactMatch: boolean;
}

describe('DynamicActiveRouterLinkDirective', () => {
  let component: TestDynamicLinkActiveDirectiveComponent;
  let fixture: ComponentFixture<TestDynamicLinkActiveDirectiveComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const events = hot('^(a|)', {
      a: new NavigationEnd(1, '/overview', '/overview')
    });
    routerSpy = {
      ...jasmine.createSpyObj('Router', ['createUrlTree', 'isActive']),
      events
    } as jasmine.SpyObj<Router>;

    TestBed.configureTestingModule({
      declarations: [
        DynamicActiveRouterLinkDirective,
        TestDynamicLinkActiveDirectiveComponent
      ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: Renderer2 }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestDynamicLinkActiveDirectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it(
    'should call renderer.addClass to html element' +
      ' when link becomes active',
    () => {
      const renderer2 = fixture.componentRef.injector.get<Renderer2>(
        Renderer2 as Type<Renderer2>
      );
      spyOn(renderer2, 'addClass');
      spyOn(renderer2, 'removeClass');
      routerSpy.isActive.and.returnValue(true);
      component.class = 'active';
      fixture.detectChanges();
      const element = fixture.nativeElement.querySelector('.dynamic-link');
      expect(renderer2.addClass).toHaveBeenCalledTimes(1);
      expect(renderer2.addClass).toHaveBeenCalledWith(element, 'active');
      expect(renderer2.removeClass).not.toHaveBeenCalled();
    }
  );

  it(
    'should call renderer.removeClass with set class from html' +
      ' element when link becomes inactive',
    () => {
      const renderer2 = fixture.componentRef.injector.get<Renderer2>(
        Renderer2 as Type<Renderer2>
      );
      spyOn(renderer2, 'addClass');
      spyOn(renderer2, 'removeClass');
      routerSpy.isActive.and.returnValue(false);
      component.class = 'active';
      fixture.detectChanges();
      const element = fixture.nativeElement.querySelector('.dynamic-link');
      expect(renderer2.removeClass).toHaveBeenCalledTimes(1);
      expect(renderer2.removeClass).toHaveBeenCalledWith(element, 'active');
      expect(renderer2.addClass).not.toHaveBeenCalled();
    }
  );

  it(
    'should call renderer.removeClass with previous set class' +
      ' when it changes and' +
      ' call renderer.addClass with new class when link is active',
    () => {
      component.class = 'active';
      fixture.detectChanges();
      const renderer2 = fixture.componentRef.injector.get<Renderer2>(
        Renderer2 as Type<Renderer2>
      );
      spyOn(renderer2, 'addClass');
      spyOn(renderer2, 'removeClass');
      routerSpy.isActive.and.returnValue(true);
      component.class = 'very-active';
      fixture.detectChanges();
      const element = fixture.nativeElement.querySelector('.dynamic-link');
      expect(renderer2.removeClass).toHaveBeenCalledTimes(1);
      expect(renderer2.removeClass).toHaveBeenCalledWith(element, 'active');
      expect(renderer2.addClass).toHaveBeenCalledTimes(1);
      expect(renderer2.addClass).toHaveBeenCalledWith(element, 'very-active');
    }
  );

  it(
    'should call renderer.removeClass with previous set class' +
      ' when it changes and' +
      ' call renderer.removeClass with new class when link becomes inactive',
    () => {
      component.class = 'active';
      fixture.detectChanges();
      const renderer2 = fixture.componentRef.injector.get<Renderer2>(
        Renderer2 as Type<Renderer2>
      );
      spyOn(renderer2, 'addClass');
      spyOn(renderer2, 'removeClass');
      routerSpy.isActive.and.returnValue(false);
      component.class = 'very-active';
      fixture.detectChanges();
      const element = fixture.nativeElement.querySelector('.dynamic-link');
      expect(renderer2.removeClass).toHaveBeenCalledTimes(2);
      expect(renderer2.removeClass).toHaveBeenCalledWith(element, 'active');
      expect(renderer2.removeClass).toHaveBeenCalledWith(
        element,
        'very-active'
      );
      expect(renderer2.addClass).not.toHaveBeenCalled();
    }
  );

  it(
    'should call renderer.addClass with set class' +
      ' when linkInstructions changes when link becomes active',
    () => {
      component.class = 'active';
      fixture.detectChanges();
      const renderer2 = fixture.componentRef.injector.get<Renderer2>(
        Renderer2 as Type<Renderer2>
      );
      spyOn(renderer2, 'addClass');
      spyOn(renderer2, 'removeClass');
      routerSpy.isActive.and.returnValue(true);
      component.instructions = ['link', 'params'];
      fixture.detectChanges();
      const element = fixture.nativeElement.querySelector('.dynamic-link');
      expect(renderer2.addClass).toHaveBeenCalledTimes(1);
      expect(renderer2.addClass).toHaveBeenCalledWith(element, 'active');
      expect(renderer2.removeClass).not.toHaveBeenCalled();
    }
  );

  it(
    'should call renderer.removeClass with set class' +
      ' when linkInstructions changes when link becomes inactive',
    () => {
      component.class = 'active';
      fixture.detectChanges();
      const renderer2 = fixture.componentRef.injector.get<Renderer2>(
        Renderer2 as Type<Renderer2>
      );
      spyOn(renderer2, 'addClass');
      spyOn(renderer2, 'removeClass');
      routerSpy.isActive.and.returnValue(false);
      component.instructions = ['link', 'params'];
      fixture.detectChanges();
      const element = fixture.nativeElement.querySelector('.dynamic-link');
      expect(renderer2.removeClass).toHaveBeenCalledTimes(1);
      expect(renderer2.removeClass).toHaveBeenCalledWith(element, 'active');
      expect(renderer2.addClass).not.toHaveBeenCalled();
    }
  );

  it(
    'should call renderer.addClass with set class' +
      ' when linkExactMatch changes when link becomes active',
    () => {
      component.class = 'active';
      fixture.detectChanges();
      const renderer2 = fixture.componentRef.injector.get<Renderer2>(
        Renderer2 as Type<Renderer2>
      );
      spyOn(renderer2, 'addClass');
      spyOn(renderer2, 'removeClass');
      routerSpy.isActive.and.returnValue(true);
      component.linkExactMatch = true;
      fixture.detectChanges();
      const element = fixture.nativeElement.querySelector('.dynamic-link');
      expect(renderer2.addClass).toHaveBeenCalledTimes(1);
      expect(renderer2.addClass).toHaveBeenCalledWith(element, 'active');
      expect(renderer2.removeClass).not.toHaveBeenCalled();
    }
  );

  it(
    'should call renderer.removeClass with set class' +
      ' when linkExactMatch changes when link becomes inactive',
    () => {
      component.class = 'active';
      fixture.detectChanges();
      const renderer2 = fixture.componentRef.injector.get<Renderer2>(
        Renderer2 as Type<Renderer2>
      );
      spyOn(renderer2, 'addClass');
      spyOn(renderer2, 'removeClass');
      routerSpy.isActive.and.returnValue(false);
      component.linkExactMatch = true;
      fixture.detectChanges();
      const element = fixture.nativeElement.querySelector('.dynamic-link');
      expect(renderer2.removeClass).toHaveBeenCalledTimes(1);
      expect(renderer2.removeClass).toHaveBeenCalledWith(element, 'active');
      expect(renderer2.addClass).not.toHaveBeenCalled();
    }
  );

  it(
    'should call renderer.addClass' +
      ' when active link is updated and dynamic link becomes active',
    () => {
      component.class = 'active';
      fixture.detectChanges();
      routerSpy.isActive.and.returnValue(true);
      const renderer2 = fixture.componentRef.injector.get<Renderer2>(
        Renderer2 as Type<Renderer2>
      );
      spyOn(renderer2, 'addClass');
      spyOn(renderer2, 'removeClass');
      getTestScheduler().flush();
      fixture.detectChanges();
      const element = fixture.nativeElement.querySelector('.dynamic-link');
      expect(renderer2.addClass).toHaveBeenCalledTimes(1);
      expect(renderer2.addClass).toHaveBeenCalledWith(element, 'active');
      expect(renderer2.removeClass).not.toHaveBeenCalled();
    }
  );

  it(
    'should call renderer.removeClass' +
      ' when active link is updated and dynamic link becomes inactive',
    () => {
      component.class = 'active';
      fixture.detectChanges();
      routerSpy.isActive.and.returnValue(false);
      const renderer2 = fixture.componentRef.injector.get<Renderer2>(
        Renderer2 as Type<Renderer2>
      );
      spyOn(renderer2, 'addClass');
      spyOn(renderer2, 'removeClass');
      getTestScheduler().flush();
      fixture.detectChanges();
      const element = fixture.nativeElement.querySelector('.dynamic-link');
      expect(renderer2.removeClass).toHaveBeenCalledTimes(1);
      expect(renderer2.removeClass).toHaveBeenCalledWith(element, 'active');
      expect(renderer2.addClass).not.toHaveBeenCalled();
    }
  );
});
