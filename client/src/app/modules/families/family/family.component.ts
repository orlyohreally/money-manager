import { Component, isDevMode, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

// tslint:disable-next-line: max-line-length
import { FamiliesService } from '@core-client/services/families/families.service';
import { FamilyView } from '@shared/types';

@Component({
  selector: 'family-family',
  templateUrl: './family.component.html',
  styleUrls: ['./family.component.scss'],
  host: {
    style: 'display: block;'
  }
})
export class FamilyComponent implements OnInit {
  family: Observable<FamilyView>;
  memberCountMapping: { [k: string]: string } = {
    '=1': '1 member',
    other: '# members'
  };
  private familyId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private familiesService: FamiliesService,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.family = merge(
      this.route.paramMap.pipe(
        map(params => {
          this.familyId = params.get('familyId');
          this.familiesService.setCurrentFamily(this.familyId);
        })
      ),
      this.familiesService.familiesInfo
    ).pipe(
      switchMap(() => {
        return this.familiesService.getFamilyById(this.familyId).pipe();
      }),
      switchMap(family => {
        return !family
          ? throwError('Family not found')
          : of({ ...family, _id: this.familyId });
      }),
      catchError(e => {
        if (isDevMode()) {
          // tslint:disable-next-line: no-console
          console.log(e);
        }
        this.ngZone.run(() => {
          this.router.navigate(['/not-found']);
        });
        return of(undefined);
      })
    );
  }
}
