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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentWithLoaderComponent implements OnInit {
  @Input() showLoader: boolean;

  constructor() {}

  ngOnInit() {}
}
