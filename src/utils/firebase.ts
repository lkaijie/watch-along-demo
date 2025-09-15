// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAZ_ETOlgcTiSzT2DuSbqcZW19Yi_37Pq0",
//   authDomain: "watch-along-8bfed.firebaseapp.com",
//   databaseURL: "https://watch-along-8bfed-default-rtdb.firebaseio.com",
//   projectId: "watch-along-8bfed",
//   storageBucket: "watch-along-8bfed.appspot.com",
//   messagingSenderId: "230842390983",
//   appId: "1:230842390983:web:09f3f939741f68853ea1e2"
// };
const firebaseConfig = {
  apiKey: "AIzaSyApJRV4whsHXKQyJyM8AvH34bu0r4LWu80",
  authDomain: "watch-along-demo-ver.firebaseapp.com",
  databaseURL: "https://watch-along-demo-ver-default-rtdb.firebaseio.com",
  projectId: "watch-along-demo-ver",
  storageBucket: "watch-along-demo-ver.firebasestorage.app",
  messagingSenderId: "1045452089883",
  appId: "1:1045452089883:web:95669c8f632f3ffb2ba6be",
  measurementId: "G-CEHNYDFBYC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
// export const db =
