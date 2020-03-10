import { Component, OnInit } from '@angular/core';
// tslint:disable-next-line: max-line-length
import { FamiliesService } from '@core-client/services/families/families.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MemberFamily } from '../shared/types/member-family';

@Component({
  selector: 'family-families',
  templateUrl: './families.component.html',
  styleUrls: ['./families.component.scss']
})
export class FamiliesComponent implements OnInit {
  families: Observable<MemberFamily[]>;

  constructor(private familiesService: FamiliesService) {}

  ngOnInit() {
    this.families = this.familiesService.familiesInfo.pipe(
      map(familiesInfo => familiesInfo.families)
    );
  }
}
