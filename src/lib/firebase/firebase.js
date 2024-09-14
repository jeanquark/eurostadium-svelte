// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, deleteApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  // apiKey: import.meta.env.VITE_API_KEY,
  apiKey: 'AIzaSyDyVXQ8WotawTgnhsqtcIplCeThjbVIpc4',
  // authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  authDomain: 'eurostadium-895f4.firebaseapp.com',
  // projectId: import.meta.env.VITE_PROJECT_ID,
  projectId: 'eurostadium-895f4',
  // storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  storageBucket: 'eurostadium-895f4.appspot.com',
  // messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  messagingSenderId: 1059997861153,
  // appId: import.meta.env.VITE_APP_ID
  appId: '1:1059997861153:web:5d98d07ca2367bc215aa60'
};

// Initialize Firebase
let firebaseApp;

if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig)
} else {
    firebaseApp = getApp()
    deleteApp(firebaseApp)
    firebaseApp = initializeApp(firebaseConfig)
}

export const db = getFirestore(firebaseApp)
export const auth = getAuth(firebaseApp)