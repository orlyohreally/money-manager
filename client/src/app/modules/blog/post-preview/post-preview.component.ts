import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { BlogPost } from '@src/app/types';

@Component({
  selector: 'blog-post-preview',
  templateUrl: './post-preview.component.html',
  styleUrls: ['./post-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostPreviewComponent implements OnInit {
  @Input() post: BlogPost;

  previewSize = { height: 200 };

  constructor() {}

  ngOnInit() {}
}
