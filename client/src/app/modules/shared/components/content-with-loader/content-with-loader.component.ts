import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';

@Component({
  selector: 'shared-content-with-loader',
  templateUrl: './content-with-loader.component.html',
  styleUrls: ['./content-with-loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'shared-content-with-loader' }
})
export class ContentWithLoaderComponent implements OnInit {
  @Input() showLoader: boolean;
  @Input() color: string;

  constructor() {}

  ngOnInit() {}
}
