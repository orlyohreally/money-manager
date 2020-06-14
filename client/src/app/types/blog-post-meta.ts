interface BlogPostShortMeta {
  slug: string;
  title: string;
  featured_image: string;
}

export interface BlogPostMeta {
  next_post: BlogPostShortMeta;
  previous_post: BlogPostShortMeta;
}
