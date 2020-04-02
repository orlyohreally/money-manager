import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

// tslint:disable-next-line: max-line-length
import { FamiliesService } from '@core-client/services/families/families.service';
import { MemberFamily } from '@shared-client/types';

@Component({
  selector: 'family-family-manager',
  templateUrl: './family-manager.component.html',
  styleUrls: ['./family-manager.component.scss']
})
export class FamilyManagerComponent implements OnInit {
  public familiesInfo: Observable<{
    families: MemberFamily[];
    currentFamily: MemberFamily;
  }>;

  constructor(private familiesService: FamiliesService) {}

  ngOnInit() {
    this.familiesInfo = this.familiesService.loadFamilies().pipe(
      switchMap(() => {
        return this.familiesService.familiesInfo;
      })
    );
  }
}
