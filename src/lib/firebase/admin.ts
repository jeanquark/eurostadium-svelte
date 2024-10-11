import admin from 'firebase-admin'
import { fireConfig } from './fireConfig'

try {
    console.log('call admin.ts file')
    admin.initializeApp({
        credential: admin.credential.cert(fireConfig),
    })
    console.log('Initialized.')
} catch (error) {
    // console.log('JM error: ', error);
    /*
     * We skip the "already exists" message which is
     * not an actual error when we're hot-reloading.
     */
    if (!/already exists/u.test(error.message)) {
        console.error('Firebase admin initialization error', error.stack)
    }
}

export default admin




// import { cert, getApps, initializeApp } from "firebase-admin/app";
// import { getFirestore } from "firebase-admin/firestore";
// import { getAuth } from "firebase-admin/auth";
// import {
//   FIREBASE_ADMIN_PRIVATE_KEY,
//   FIREBASE_ADMIN_CLIENT_EMAIL,
// } from "$env/static/private";
// import { PUBLIC_FIREBASE_PROJECT_ID } from "$env/static/public";

// function makeApp() {
//   const apps = getApps();
//   if (apps.length > 0) {
//     return apps[0]!;
//   }

//   return initializeApp({
//     credential: credential.cert({
//       privateKey: FIREBASE_ADMIN_PRIVATE_KEY,
//       clientEmail: FIREBASE_ADMIN_CLIENT_EMAIL,
//       projectId: PUBLIC_FIREBASE_PROJECT_ID,
//     }),
//     databaseURL: `https://${PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
//   });
// }
// export const firebase = makeApp();
// export const auth = getAuth(firebase);
// export const firestore = getFirestore();