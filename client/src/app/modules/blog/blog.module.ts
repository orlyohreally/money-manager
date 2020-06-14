import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  MatCardModule,
  MatDividerModule,
  MatIconModule
} from '@angular/material';

import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../shared/shared.module';
import { BlogRoutingModule } from './blog-routing.module';
import { PostDetailsComponent } from './post-details/post-details.component';
import { PostPreviewComponent } from './post-preview/post-preview.component';
import { PostComponent } from './post/post.component';
import { PostsListComponent } from './posts-list/posts-list.component';

@NgModule({
  declarations: [
    PostsListComponent,
    PostDetailsComponent,
    PostComponent,
    PostPreviewComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    BlogRoutingModule,
    SharedModule
  ]
})
export class BlogModule {}
