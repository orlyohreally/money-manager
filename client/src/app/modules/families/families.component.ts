import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

// tslint:disable-next-line: max-line-length
import { FamiliesService } from '@core-client/services/families/families.service';
import { FamilyView } from '@shared/types';

@Component({
  selector: 'family-families',
  templateUrl: './families.component.html',
  styleUrls: ['./families.component.scss']
})
export class FamiliesComponent implements OnInit {
  families: Observable<FamilyView[]>;

  constructor(private familiesService: FamiliesService) {}

  ngOnInit() {
    this.families = this.familiesService.getFamiliesList();
  }
}
