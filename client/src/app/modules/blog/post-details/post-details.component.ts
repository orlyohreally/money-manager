import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { BlogPost } from '@src/app/types';

@Component({
  selector: 'blog-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostDetailsComponent implements OnInit {
  @Input() post: BlogPost;

  constructor() {}

  ngOnInit() {
    console.log(this.post);
  }
}
