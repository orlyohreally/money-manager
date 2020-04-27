import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Directive({
  selector: '[sharedDynamicActiveRouterLink]'
})
export class DynamicActiveRouterLinkDirective implements OnInit, OnChanges {
  @Input() sharedDynamicActiveRouterLink: string;
  @Input() linkInstructions: any[];
  @Input() linkExactMatch: boolean;

  private defaultExactMatch = false;

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private router: Router
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateClasses();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['sharedDynamicActiveRouterLink'] &&
      changes['sharedDynamicActiveRouterLink'].previousValue
    ) {
      this.renderer.removeClass(
        this.elRef.nativeElement,
        changes['sharedDynamicActiveRouterLink'].previousValue
      );
    }
    this.updateClasses();
  }

  private updateClasses() {
    const isActive: boolean = this.router.isActive(
      this.router.createUrlTree(this.linkInstructions),
      this.linkExactMatch || this.defaultExactMatch
    );
    if (isActive) {
      this.renderer.addClass(
        this.elRef.nativeElement,
        this.sharedDynamicActiveRouterLink
      );
      return;
    }
    this.renderer.removeClass(
      this.elRef.nativeElement,
      this.sharedDynamicActiveRouterLink
    );
  }
}
