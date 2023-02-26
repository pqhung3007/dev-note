import { useState } from "react";
import { db, fromMillis, postToJSON } from "../lib/firebase";

import Loader from "../components/Loader";
import PostFeed from "../components/PostFeed";

// max post to query per page
const LIMIT = 1;

export default function Home({ posts }) {
  const [postList, setPostList] = useState(posts);
  const [loading, setLoading] = useState(false);
  const [isTheLastPost, setIsTheLastPost] = useState(false);
  console.log(posts);

  const handleLoadMorePosts = async () => {
    setLoading(true);
    const last = postList[postList.length - 1];

    const cursor =
      typeof last.createdAt === "number"
        ? fromMillis(last.createdAt)
        : last.createdAt;

    const query = db
      .collectionGroup("posts")
      .where("published", "==", true)
      .orderBy("createdAt", "desc")
      .startAfter(cursor)
      .limit(LIMIT);

    const newPosts = (await query.get()).docs.map(postToJSON);

    setPostList(postList.concat(newPosts));
    setLoading(false);

    if (newPosts.length < LIMIT) {
      setIsTheLastPost(true);
    }
  };

  return (
    <main>
      <PostFeed posts={posts} />
      <Loader show={loading} />

      {!loading && !isTheLastPost ? (
        <button onClick={handleLoadMorePosts}>Load more</button>
      ) : null}
    </main>
  );
}

export async function getServerSideProps(context) {
  const postsQuery = db
    .collectionGroup("posts")
    .where("published", "==", true)
    .orderBy("createdAt", "desc")
    .limit(LIMIT);

  const posts = (await postsQuery.get()).docs.map(postToJSON);

  return {
    props: { posts }, // will be passed to the page component as props
  };
}
