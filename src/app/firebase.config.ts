import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { environment } from '../environments/environment';

// Initialize Firebase
const firebaseApp = initializeApp(environment.firebaseConfig);

// Initialize Firebase services
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { firebaseApp, auth, firestore, storage };

// This function is needed for Angular's provideFirebaseApp
// and other providers to work with the same instance
export function getFirebaseApp() {
  return firebaseApp;
}
