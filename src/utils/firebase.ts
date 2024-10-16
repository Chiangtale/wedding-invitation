import { FirebaseOptions, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseOptions: FirebaseOptions = {
  apiKey: "AIzaSyBdxz_Ri5wK-df4wL2ZFNcAG5bwSI9b2-Y",
  authDomain: "chiangtale.firebaseapp.com",
  projectId: "chiangtale",
  storageBucket: "chiangtale.appspot.com",
  messagingSenderId: "570297251521",
  appId: "1:570297251521:web:56acf621178e87f552c640",
  measurementId: "G-QDWJTMP70D"
};

const app = initializeApp(firebaseOptions);
export const db = getFirestore(app);

export default app;
