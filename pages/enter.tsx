import Image from "next/image";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import { auth, googleAuthProvider } from "../lib/firebase";
import google from "../public/assets/google.png";

export default function Enter(props) {
  const { user, username } = useContext(UserContext);

  return <main>{!user ? <SignInButton /> : null}</main>;
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
