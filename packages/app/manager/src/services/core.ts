import { initializeApp } from 'firebase/app';
import { getAuth, signOut, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

import DB from '@minhas-financas/services/db';
import AuthServices from '@minhas-financas/services/auth';
import UserServices from '@minhas-financas/services/user';
import TagsServices from '@minhas-financas/services/tags';
import BudgetsServices from '@minhas-financas/services/budgets';
import CategoriesServices from '@minhas-financas/services/categories';

// VARIABLES
export const url = {
    sso: import.meta.env.VITE_SSO_URL,
    manager: import.meta.env.VITE_MANAGER_URL,
};

export const release = import.meta.env.VITE_RELEASE;

export const isLocal = import.meta.env.VITE_ENV === 'local';

// FIREBASE
const app = initializeApp({
    appId: import.meta.env.VITE_APP_ID,
    apiKey: import.meta.env.VITE_API_KEY,
    projectId: import.meta.env.VITE_PROJECT_ID,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    measurementId: import.meta.env.VITE_MEASUREMENT_ID,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
}, 'manager');

// FIREBASE SERVICES
const firebaseAuth = getAuth(app);
const firestore = getFirestore(app);

export const authServices = new AuthServices({
    signOut: () => signOut(firebaseAuth),
}, url.sso);

export const db = new DB(firestore);

if (isLocal) {
    connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
    connectAuthEmulator(firebaseAuth, 'http://localhost:9099');
}

// ENTITY SERVICES
export const userServices = new UserServices(db, url.sso);

export const tagsServices = new TagsServices(db);
export const budgetsServices = new BudgetsServices(db);
export const categoriesServices = new CategoriesServices(db);