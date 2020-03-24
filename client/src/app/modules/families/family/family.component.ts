import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// tslint:disable-next-line: max-line-length
import { FamiliesService } from '@core-client/services/families/families.service';
import { FamilyView } from '@shared/types';
import { Observable, Subject } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'family-family',
  templateUrl: './family.component.html',
  styleUrls: ['./family.component.scss'],
  host: {
    style: 'display: block;'
  }
})
export class FamilyComponent implements OnInit, OnDestroy {
  family: Observable<FamilyView>;

  private familyId: string;
  private destroyed = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private familiesService: FamiliesService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.familyId = params.get('familyId');

      this.familiesService.setCurrentFamily(this.familyId);
      this.family = this.getFamily(this.familyId);
    });

    this.familiesService.familiesInfo
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => {
        this.family = this.getFamily(this.familyId);
      });
  }

  private getFamily(familyId: string): Observable<FamilyView> {
    return this.familiesService.getFamily(familyId).pipe(
      map(family => {
        return { ...family, _id: familyId };
      }),
      catchError(() => {
        this.router.navigate(['/']);
        return [];
      })
    );
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
