// src/firebaseConfig.js
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSy...',
  authDomain: 'ticketmasterstuff.firebaseapp.com',
  projectId: 'ticketmasterstuff',
  storageBucket: 'ticketmasterstuff.appspot.com',
  messagingSenderId: '219663317324',
  appId: '1:219663317324:web:5d7964b47ae504bc95f7e9',
  measurementId: 'G-RS3GG1HZ60',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const firestore = getFirestore(app) // Initialize Firestore

export { firestore }
