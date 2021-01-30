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
const providerAuth = firebase.auth
const db = firebase.database()

const getProviderForProviderId = (method) => {
  let provider = null
  switch (method) {
    case 'google.com':
      provider = new providerAuth.GoogleAuthProvider()
      provider.addScope('openid')
      provider.addScope('profile')
      provider.addScope('email')
      break;
    case 'facebook.com':
      provider = new providerAuth.FacebookAuthProvider()
      provider.addScope('email')
      provider.setCustomParameters({
        'display': 'popup'
      })
      break;
    case 'github.com':
      provider = new firebase.auth.GithubAuthProvider()
      provider.addScope('user:email')
      provider.addScope('read:user')
      break;
  }
  return provider
}

export {
  fbAuth,
  providerAuth,
  getProviderForProviderId,
  db
}
