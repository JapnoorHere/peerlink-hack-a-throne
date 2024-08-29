
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDNh1mNJQKDp2sirLLZM-ZfucfRhOIJKdk",
  authDomain: "hack-a-throne-education-4d558.firebaseapp.com",
  projectId: "hack-a-throne-education-4d558",
  storageBucket: "hack-a-throne-education-4d558.appspot.com",
  messagingSenderId: "241783149379",
  appId: "1:241783149379:web:c1a055da9b2ffd5d0c15f6",
  measurementId: "G-QD1GX2WHJ8"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app)

export {storage}
