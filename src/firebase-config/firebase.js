// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDxf8Cq5wykL7jQBzxhCmQPJGnWof_wxLg',
  authDomain: 'fir-course-472c1.firebaseapp.com',
  projectId: 'fir-course-472c1',
  storageBucket: 'fir-course-472c1.appspot.com',
  messagingSenderId: '1038081350476',
  appId: '1:1038081350476:web:c8bec49244d69dd0338de9',
  measurementId: 'G-3P1E10KSP8',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
