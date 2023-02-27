import { useRouter } from "next/router";
import { useState } from "react";
import * as firebase from "firebase/firebase-firestore";
import "firebase/auth";
import "firebase/firestore";

import AuthenticationCheck from "../../components/AuthenticationCheck";
import { db, auth } from "../../lib/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import Link from "next/link";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import { serverTimestamp } from "firebase/firestore";

export default function AdminPostEdit() {
  return (
    <AuthenticationCheck>
      <PostManager />
    </AuthenticationCheck>
  );
}

function PostManager() {
  const [isInPreviewMode, setIsInPreviewMode] = useState(false);

  const router = useRouter();
  const { slug } = router.query as { slug: string };
  const postRef = db
    .collection("users")
    .doc(auth.currentUser.uid)
    .collection("posts")
    .doc(slug) as firebase.firestore.DocumentReference;
  const [post] = useDocumentData(postRef);

  return (
    <main>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>

            <PostForm
              postRef={postRef}
              defaultValues={post}
              preview={isInPreviewMode}
            />
          </section>

          <aside>
            <h3>Tools</h3>
            <button onClick={() => setIsInPreviewMode(!isInPreviewMode)}>
              {isInPreviewMode ? "Edit" : "Preview"}
            </button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className="btn-blue">Live view</button>
            </Link>
          </aside>
        </>
      )}
    </main>
  );
}

function PostForm({ defaultValues, postRef, preview }) {
  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const updatePost = async ({ content, published }) => {
    await postRef.update({
      content,
      published,
      updatedAt: serverTimestamp(),
    });

    reset({ content, published });
  };

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div>
          <ReactMarkdown>{watch("content")}</ReactMarkdown>
        </div>
      )}

      <div>
        {/* https://stackoverflow.com/questions/67791756/react-hook-form-error-type-useformregisterformdata-is-not-assignable-to-ty */}
        <textarea name="content" {...register("content")}></textarea>

        <fieldset>
          <input name="published" type="checkbox" {...register("published")} />
          <label>Published</label>
        </fieldset>

        <button type="submit" className="text-3xl text-sky-500">
          Save Changes
        </button>
      </div>
    </form>
  );
}
