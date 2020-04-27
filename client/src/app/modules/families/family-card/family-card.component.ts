import { Component, Input, isDevMode, OnInit } from '@angular/core';
import { FamilyView } from '@shared/types';

@Component({
  selector: 'family-card',
  templateUrl: './family-card.component.html',
  styleUrls: ['./family-card.component.scss'],
  host: { class: 'card' }
})
export class FamilyCardComponent implements OnInit {
  @Input() family: FamilyView;

  isDevMode = isDevMode();

  constructor() {}

  ngOnInit() {}
}
