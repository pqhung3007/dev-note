import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../lib/firebase";

export function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);

  // listen to real-time update
  useEffect(() => {
    let subscriber;

    if (user) {
      const ref = db.collection("users").doc(user.uid);

      subscriber = ref.onSnapshot((doc) => {
        setUsername(doc.data()?.username);
      });
    } else {
      setUsername(null);
    }

    return subscriber;
  }, [user, username]);

  return { user, username };
}
