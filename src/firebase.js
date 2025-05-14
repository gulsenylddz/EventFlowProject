// Firebase'i başlatmak için gerekenler
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Bu config senin ekranında gördüğün config olacak!
const firebaseConfig = {
  apiKey: "AIzaSyCp2fIu2oq-AdsrR7wMLC2mH1ybsD62bMI",
  authDomain: "eventflowproject-13462.firebaseapp.com",
  projectId: "eventflowproject-13462",
  storageBucket: "eventflowproject-13462.appspot.com",
  messagingSenderId: "589951093800",
  appId: "1:589951093800:web:7729484fa50834f7a791d"
};

// Uygulamayı başlat
const app = initializeApp(firebaseConfig);

// Firestore'u başlat
const db = getFirestore(app);
export const auth = getAuth(app); // ✅ Auth burada tanımlandı
const storage = getStorage(app); // ✅ storage oluştur

export { db,storage };
