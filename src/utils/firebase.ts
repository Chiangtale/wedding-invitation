import { FirebaseOptions, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseOptions: FirebaseOptions = {
  apiKey: "AIzaSyBdxz_Ri5wK-df4wL2ZFNcAG5bwSI9b2-Y",
  authDomain: "chiangtale.firebaseapp.com",
  projectId: "chiangtale",
  storageBucket: "chiangtale.appspot.com",
  messagingSenderId: "570297251521",
  appId: "1:570297251521:web:d8ff95eb2982153052c640",
  measurementId: "G-XYRYH11FWN"
};

const app = initializeApp(firebaseOptions);
export const db = getFirestore(app);

export default app;
