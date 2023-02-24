import Image from "next/image";
const { auth, googleAuthProvider } = require("../lib/firebase");
import google from "../public/assets/google.png";

export default function Enter(props) {
  const user = null;
  const username = null;

  return (
    <main>
      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
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

function SignOutButton() {
  return null;
}

function UsernameForm() {
  return null;
}
