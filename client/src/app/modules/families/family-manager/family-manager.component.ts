import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

// tslint:disable-next-line: max-line-length
import { FamiliesService } from '@core-client/services/families/families.service';
import { FamilyView } from '@shared/types';

@Component({
  selector: 'family-family-manager',
  templateUrl: './family-manager.component.html',
  styleUrls: ['./family-manager.component.scss']
})
export class FamilyManagerComponent implements OnInit {
  public familiesInfo: Observable<{
    families: FamilyView[];
    currentFamily: FamilyView;
  }>;

  constructor(private familiesService: FamiliesService) {}

  ngOnInit() {
    this.familiesInfo = this.familiesService.familiesInfo;
  }
}
