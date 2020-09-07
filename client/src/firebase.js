import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCRkR8v9JwJ725xD5D3PLRcY5sjoA4OhOU",
  authDomain: "dinnerisready-4854d.firebaseapp.com",
  databaseURL: "https://dinnerisready-4854d.firebaseio.com",
  projectId: "dinnerisready-4854d",
  storageBucket: "dinnerisready-4854d.appspot.com",
  messagingSenderId: "21158814559",
  appId: "1:21158814559:web:f57f0fae3ecd6695854cea"
}

firebase.initializeApp(firebaseConfig);
const provider = new firebase.auth.GoogleAuthProvider();

export const signInWithGoogle = () => auth.signInWithPopup(provider);

export const generateUserDocument = async (user, additionalData) => {
  if (!user) return;
  const userRef = firestore.doc(`users/${user.uid}`);
  const snapshot = await userRef.get();
  if (!snapshot.exists) {
    const { email, displayName } = user;
    try {
      await userRef.set({
        displayName,
        email,
        ...additionalData
      });
    } catch (error) {
      console.error("Error creating user document", error);
    }
  }
  return getUserDocument(user.uid);
};
const getUserDocument = async uid => {
  if (!uid) return null;
  try {
    const userDocument = await firestore.doc(`users/${uid}`).get();
    return {
      uid,
      ...userDocument.data()
    };
  } catch (error) {
    console.error("Error fetching user", error);
  }
};

export const auth = firebase.auth();
export const firestore = firebase.firestore();