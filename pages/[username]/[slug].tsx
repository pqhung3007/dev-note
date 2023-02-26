import { useDocumentData } from "react-firebase-hooks/firestore";
import { db, getUserWithUsername, postToJSON } from "../../lib/firebase";

import PostContent from "../../components/PostContent";
import MetaTags from "../../components/MetaTags";
import * as firebase from "firebase/firebase-firestore";
import "firebase/auth";
import "firebase/firestore";

// interface MyPost {
//   content: string;
//   slug: string;
//   uid: string;
//   published: boolean;
//   createdAt: number;
//   updatedAt: number;
//   username: string;
//   heartCount: number;
// }

export default function Post({ post, path }) {
  const postRef = db.doc(path) as firebase.firestore.DocumentReference;
  const [realtimePost] = useDocumentData(postRef);
  const renderedPost = realtimePost || post;
  return (
    <main>
      <MetaTags title={post.title} description={post.content} />
      <section>
        <PostContent post={renderedPost} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} 🤍</strong>
        </p>
      </aside>
    </main>
  );
}

export async function getStaticProps({ params }) {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  let post;
  let path;

  if (userDoc) {
    const postRef = userDoc.ref.collection("posts").doc(slug);
    post = postToJSON(await postRef.get());
    path = postRef.path;
  }

  return {
    props: { post, path },
    // regenerate post page on request after 5 seconds
    revalidate: 100,
  };
}

export async function getStaticPaths() {
  // get all documents from collection 'posts'
  const snapshot = await db.collectionGroup("posts").get();

  // get the path of each document
  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });

  return {
    /* paths: [
       params: { username, slug }
    ] */
    paths,
    // fallback: false means that any paths not returned by getStaticPaths will result in a 404 page.
    fallback: "blocking",
  };
}
