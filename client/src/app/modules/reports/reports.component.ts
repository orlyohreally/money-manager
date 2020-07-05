import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  familyId: Observable<string>;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.familyId = this.route.data.pipe(
      map((data: { familyId: string }) => {
        return data.familyId;
      })
    );
  }
}
