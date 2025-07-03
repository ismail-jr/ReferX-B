//D:\ismail\referx\deleteAllUserDocs.ts
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';

// Load service account JSON from file (or use process.env if using base64 method)
const serviceAccount = JSON.parse(
  readFileSync('./serviceAccount.json', 'utf-8')
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = getFirestore();

async function deleteAllUserDocs() {
  const usersRef = db.collection('users');
  const snapshot = await usersRef.get();

  if (snapshot.empty) {
    console.log('No user documents found in Firestore.');
    return;
  }

  const batch = db.batch();

  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();
  console.log(`✅ Deleted ${snapshot.size} user document(s) from Firestore.`);
}

deleteAllUserDocs().catch(console.error);
