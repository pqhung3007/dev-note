import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import * as firebase from "firebase/firebase-firestore";
import "firebase/auth";
import "firebase/firestore";
import kebabCase from "lodash.kebabcase";

import { db, auth, serverTimestamp } from "../../lib/firebase";
import { UserContext } from "../../lib/context";
import AuthenticationCheck from "../../components/AuthenticationCheck";
import PostFeed from "../../components/PostFeed";
import { toast } from "react-hot-toast";

export default function AdminPostsPage() {
  return (
    <main>
      <AuthenticationCheck>
        <PostList />
        <CreateNewPost />
      </AuthenticationCheck>
    </main>
  );
}

function PostList() {
  const ref = db
    .collection("users")
    .doc(auth.currentUser.uid)
    .collection("posts");
  const query = ref.orderBy("createdAt") as firebase.firestore.Query;
  const [querySnapshot] = useCollection(query);

  const posts = querySnapshot?.docs.map((doc) => doc.data());
  return (
    <>
      <h1>Manage your Posts</h1>
      <PostFeed posts={posts} />
    </>
  );
}

function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState("");

  const generatedSlug = encodeURI(kebabCase(title));
  const hasValidLength = title.length > 3 && title.length < 100;

  const handleCreatePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const uid = auth.currentUser.uid;
    const ref = db
      .collection("users")
      .doc(uid)
      .collection("posts")
      .doc(generatedSlug);

    const data = {
      title,
      slug: generatedSlug,
      uid,
      username,
      published: false,
      content: "# hello world!",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };
    await ref.set(data);

    toast.success("Post created");
    router.push(`/admin/${generatedSlug}`);
  };

  return (
    <form onSubmit={handleCreatePost}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="My Awesome Article!"
      />
      <p>
        <strong>Slug:</strong> {generatedSlug}
      </p>
      <button type="submit" disabled={!hasValidLength} className="btn-green">
        Create New Post
      </button>
    </form>
  );
}
