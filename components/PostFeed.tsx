import PostItem from "./PostItem";

export default function PostFeed({ posts }) {
  return posts
    ? posts.map((post) => <PostItem key={post.slug} post={post} />)
    : null;
}
