// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyDhfHltBMnkal6xuwXXoFw-p6kJt9CV5rk",
//   authDomain: "chatrtc-abb19.firebaseapp.com",
//   projectId: "chatrtc-abb19",
//   storageBucket: "chatrtc-abb19.appspot.com",
//   messagingSenderId: "687670947909",
//   appId: "1:687670947909:web:27bc60f04ffaa03880b32c"
// };

const firebaseConfig = {
  apiKey: "AIzaSyAiBAorufUxiwZuYivxXJJ-3sDV6IZhiKI",
  authDomain: "chatrtctesting.firebaseapp.com",
  projectId: "chatrtctesting",
  storageBucket: "chatrtctesting.firebasestorage.app",
  messagingSenderId: "757871775282",
  appId: "1:757871775282:web:45396a36cebd8ef12bf62b",
  measurementId: "G-73692Y6H25"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage();

