import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FamiliesService } from '../services/families/families.service';
import { MemberFamily } from '../../shared/types/member-family';

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
    this.familiesService.loadFamilies().subscribe(() => {
      this.familiesInfo = this.familiesService.familiesInfo;
    });
  }
}
