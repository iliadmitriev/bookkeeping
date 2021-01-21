import firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBNRf-s1n2aPsCy-0EwGiOTxBZ0MM1N8w4",
  authDomain: "bookkeeper-idm.firebaseapp.com",
  databaseURL: "https://bookkeeper-idm-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bookkeeper-idm",
  storageBucket: "bookkeeper-idm.appspot.com",
  messagingSenderId: "198264160911",
  appId: "1:198264160911:web:b251bff4b7b3dce93fe6fa"
};

firebase.initializeApp(firebaseConfig);

const fbAuth = firebase.auth()
const db = firebase.database()

export {
  fbAuth,
  db
}
