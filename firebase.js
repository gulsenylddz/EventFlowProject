// firebase.js
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const db = firestore();        // db.collection(...) şeklinde çalışacak
export const firebaseAuth = auth();   // auth().signInWithEmailAndPassword(...)
