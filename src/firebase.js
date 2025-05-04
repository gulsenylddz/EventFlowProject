// Firebase SDK'dan modülleri import et
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import auth from '@react-native-firebase/auth'; 
// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCp2fIu2oq-AdsrR7wMLC2mH1ybsD62bMI",
    authDomain: "eventflowproject-13462.firebaseapp.com",
    projectId: "eventflowproject-13462",
    storageBucket: "eventflowproject-13462.appspot.com",
    messagingSenderId: "589951093800",
    appId: "1:589951093800:web:7729484fa503834f7a791d"
};

// initializeApp zaten varsa tekrar oluşturma
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
  
export { auth , db };
