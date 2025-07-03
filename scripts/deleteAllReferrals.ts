import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';

// Load service account credentials
const serviceAccount = JSON.parse(
  readFileSync('./serviceAccount.json', 'utf-8')
);

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = getFirestore();

async function deleteAllReferralDocs() {
  const referralsRef = db.collection('referrals');
  const snapshot = await referralsRef.get();

  if (snapshot.empty) {
    console.log('❌ No referral documents found in Firestore.');
    return;
  }

  const batch = db.batch();

  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();
  console.log(`✅ Deleted ${snapshot.size} referral document(s) from Firestore.`);
}

deleteAllReferralDocs().catch(console.error);
