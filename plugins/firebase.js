import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";

var config = {
  apiKey: "AIzaSyB3iCci1H7b_fxcv9FSSI3y3kGqNAbfNcI",
  authDomain: "image-hosting-app.firebaseapp.com",
  databaseURL: "https://image-hosting-app.firebaseio.com",
  projectId: "image-hosting-app",
  storageBucket: "image-hosting-app.appspot.com",
  messagingSenderId: "604250732055",
  appId: "1:604250732055:web:d5b8addfb886c4d5"
};

!firebase.apps.length ? firebase.initializeApp(config) : "";
export const GoogleProvider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export const DB = firebase.database();
export const StoreDB = firebase.firestore();
export default firebase;
