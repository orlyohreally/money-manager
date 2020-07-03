import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'about-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutUsComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
