import * as firebase from 'firebase';

const path = `log-entries`;
const firebaseRefKey = `/sessions`;

const authenticateWithFirebase = (config) => {
  const authPromise = new Promise((resolve, reject) => {
    firebase.initializeApp(config);

    firebase.auth().signInAnonymously().catch((error) => {
      reject(error);
    });

    firebase.auth().onAuthStateChanged((user) => {
      let ref;
      if (user) {
        // User is signed in.
        ref = firebase
          .database()
          .ref(firebaseRefKey);

        resolve({ ref, path });
      } else {
        // User is signed out.
        ref = null;
        reject({ ref, path });
      }
    });
  });

  return authPromise;
};

export default authenticateWithFirebase;
