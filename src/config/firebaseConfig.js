import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// THIS IS USED TO INITIALIZE THE firebase OBJECT
// PUT YOUR FIREBASE PROJECT CONFIG STUFF HERE
var firebaseConfig = {
    apiKey: "AIzaSyBTyWh5mzxFaBGD4GYGcq0pDlpSR2LJD54",
    authDomain: "sk-wireframer.firebaseapp.com",
    databaseURL: "https://sk-wireframer.firebaseio.com",
    projectId: "sk-wireframer",
    storageBucket: "sk-wireframer.appspot.com",
    messagingSenderId: "76816119783",
    appId: "1:76816119783:web:4b9c0a80d3951ddb012f42",
    measurementId: "G-5LCNMM5DMV"
  };
firebase.initializeApp(firebaseConfig);

// NOW THE firebase OBJECT CAN BE CONNECTED TO THE STORE
export default firebase;