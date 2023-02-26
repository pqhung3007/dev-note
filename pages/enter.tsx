import Image from "next/image";
import { useState, useEffect, useContext, useCallback } from "react";
import debounce from "lodash.debounce";
import { UserContext } from "../lib/context";
import { auth, googleAuthProvider, db } from "../lib/firebase";

import MetaTags from "../components/MetaTags";
import google from "../public/assets/google.png";

export default function Enter() {
  const { user, username } = useContext(UserContext);

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <MetaTags title="Enter" description="Let's try this amazing app" />
      {user ? !username ? <UsernameForm /> : null : <SignInButton />}
    </main>
  );
}

function SignInButton() {
  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider);
  };

  return (
    <button
      className="inline-flex items-center rounded-md bg-gray-100 px-4 py-3 text-gray-700 shadow-md hover:bg-gray-200"
      onClick={signInWithGoogle}
    >
      <Image src={google} alt="" className="mr-2 h-8 w-8" />
      Sign in with Google
    </button>
  );
}

function UsernameForm() {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.toLowerCase();
    /* the username regex matches string that satisfies the following conditions:
        The string is between 3 and 15 characters long.
        The string contains only alphanumeric characters, underscores, or periods.
        The string does not contain consecutive periods or underscores.
        The string starts and ends with any character except for periods or underscores.  */
    const regex = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
    if (input.length < 3) {
      setFormValue(input);
      setLoading(false);
      setIsValid(false);
    }
    if (regex.test(input)) {
      setFormValue(input);
      setLoading(true);
      setIsValid(false);
    }
  };

  // wait for user to stop typing for 500ms before checking username availability
  const checkUsername = useCallback(
    debounce(async (username: string) => {
      if (username.length >= 3) {
        const ref = db.doc(`usernames/${username}`);
        const { exists } = await ref.get();
        setIsValid(!exists);
        setLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue, checkUsername]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userDoc = db.doc(`users/${user.uid}`);
      const usernameDoc = db.doc(`usernames/${formValue}`);

      // commit to batch write
      const batch = db.batch();
      batch.set(userDoc, {
        username: formValue,
        photoURL: user.photoURL,
        displayName: user.displayName,
      });
      batch.set(usernameDoc, { uid: user.uid });

      await batch.commit();
    } catch (error) {
      console.log(error);
    }
  };

  return !username ? (
    <div className="flex justify-center">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="success"
            className="mb-2 block text-lg font-medium text-gray-700 "
          >
            Your username
          </label>
          <input
            type="text"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-700 focus:border-blue-500 focus:ring-blue-500"
            value={formValue}
            placeholder="e.g: username1234"
            onChange={handleChange}
          />

          <UsernameMessage
            username={formValue}
            isValid={isValid}
            loading={loading}
          />

          <button
            type="submit"
            className="mt-4 block w-full rounded-lg border border-gray-300 bg-blue-600 p-3 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!isValid}
          >
            Choose
          </button>
        </form>
      </div>
    </div>
  ) : null;
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p className="mt-2 text-gray-700">Checking...</p>;
  } else if (isValid) {
    return <p className="mt-2 text-green-600">{username} is available!</p>;
  } else if (username.length > 3 && !isValid) {
    return <p className="mt-2 text-red-600">This username is already taken!</p>;
  } else if (username && username.length < 3) {
    return (
      <p className="mt-2 text-red-600">
        Username must be at least 3 characters long.
      </p>
    );
  }
  return null;
}
