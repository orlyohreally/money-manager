import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';

@Component({
  selector: 'shared-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderComponent implements OnInit {
  @Input() diameter: number;
  @Input() color: 'primary' | 'accent' | 'warn';

  defaultDiameter = 50;
  defaultColor = 'primary';

  constructor() {}

  ngOnInit() {}
}
