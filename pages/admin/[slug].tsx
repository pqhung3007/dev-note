import { useRouter } from "next/router";
import { useState } from "react";
import * as firebase from "firebase/firebase-firestore";
import "firebase/auth";
import "firebase/firestore";
import { toast } from "react-hot-toast";

import AuthenticationCheck from "../../components/AuthenticationCheck";
import { db, auth } from "../../lib/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import Link from "next/link";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import { serverTimestamp } from "firebase/firestore";
import ImageUploader from "../../components/ImageUploader";

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

interface IFormInput {
  content: string;
  published: boolean;
}

function PostForm({ defaultValues, postRef, preview }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm<IFormInput>({
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

    toast.success("Post updated successfully!");
  };

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div>
          <ReactMarkdown>{watch("content")}</ReactMarkdown>
        </div>
      )}

      <ImageUploader />

      <div>
        {/* https://stackoverflow.com/questions/67791756/react-hook-form-error-type-useformregisterformdata-is-not-assignable-to-ty */}
        <textarea
          name="content"
          {...register("content", {
            minLength: { value: 10, message: "Content too short" },
            required: { value: true, message: "Field cannot be empty" },
          })}
        ></textarea>
        {errors.content && <p>{errors.content.message}</p>}

        <fieldset>
          <input name="published" type="checkbox" {...register("published")} />
          <label>Published</label>
        </fieldset>

        <button
          type="submit"
          className="text-3xl text-sky-500"
          disabled={!isDirty || !isValid}
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
