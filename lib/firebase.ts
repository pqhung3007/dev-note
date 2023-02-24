import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAKWFEZE1Lb3LJeywttytvJLA_fvpcSPEs",
  authDomain: "dev-note-9ae9b.firebaseapp.com",
  projectId: "dev-note-9ae9b",
  storageBucket: "dev-note-9ae9b.appspot.com",
  messagingSenderId: "884699738543",
  appId: "1:884699738543:web:279e9fbc4eb20d89353f5a",
  measurementId: "G-CG8WP13HEM",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();
