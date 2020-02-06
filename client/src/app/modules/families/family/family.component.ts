import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// tslint:disable-next-line: max-line-length
import { FamiliesService } from '@core-client/services/families/families.service';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'family-family',
  templateUrl: './family.component.html',
  styleUrls: ['./family.component.scss'],
  host: {
    style: 'display: block;'
  }
})
export class FamilyComponent implements OnInit, OnDestroy {
  family: Observable<{
    _id: string;
    name: string;
    icon: string;
    membersCount: number;
  }>;

  private familyId: string;
  private destroyed = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
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

  private getFamily(
    familyId: string
  ): Observable<{
    _id: string;
    name: string;
    icon: string;
    membersCount: number;
  }> {
    return this.familiesService.getFamily(familyId).pipe(
      map((family: { name: string; icon: string; membersCount: number }) => {
        return { ...family, _id: familyId };
      })
    );
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
