// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDLtJRUEFGYNeCtGantIHxmAkoU-9uA28Y',
  authDomain: 'schemeup-3e20a.firebaseapp.com',
  projectId: 'schemeup-3e20a',
  storageBucket: 'schemeup-3e20a.appspot.com',
  messagingSenderId: '352116277955',
  appId: '1:352116277955:web:ca398b1156770c11b0d876',
  measurementId: 'G-THQ6C6ZNRF',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
