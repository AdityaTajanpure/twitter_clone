import firebase from "firebase/app"
import "firebase/firestore"

var firebaseConfig = {
  apiKey: "AIzaSyCkiZGsbHmgpXGypkxVOqkeguJhOEWEQUo",
  authDomain: "quotes-61758.firebaseapp.com",
  projectId: "quotes-61758",
  storageBucket: "quotes-61758.appspot.com",
  messagingSenderId: "277022043364",
  appId: "1:277022043364:web:a91a764c125da5013910f1",
  measurementId: "G-H78JMHKVR2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let db = firebase.firestore();

export default db;
