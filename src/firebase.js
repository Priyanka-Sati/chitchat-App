import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBnanjFghiv-T7kct59Z_mMiPNevxNuxuM",
    authDomain: "chitchat-app-cc755.firebaseapp.com",
    projectId: "chitchat-app-cc755",
    storageBucket: "chitchat-app-cc755.appspot.com",
    messagingSenderId: "809846674239",
    appId: "1:809846674239:web:d4f6c41b1f886a8ba9f98a",
    measurementId: "G-BXSVDKV8V8"
  });

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  
export  {db, auth, storage};