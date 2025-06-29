// deleteAllUsers.ts
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import * as fs from 'fs';

const serviceAccount = JSON.parse(
  fs.readFileSync('serviceAccountKey.json', 'utf-8')
);

initializeApp({
  credential: cert(serviceAccount)
});

const auth = getAuth();

async function deleteAllUsers(nextPageToken?: string): Promise<void> {
  const listUsersResult = await auth.listUsers(1000, nextPageToken);
  const uids = listUsersResult.users.map((userRecord) => userRecord.uid);

  if (uids.length > 0) {
    await auth.deleteUsers(uids);
    console.log(`Deleted ${uids.length} users`);
  }

  if (listUsersResult.pageToken) {
    await deleteAllUsers(listUsersResult.pageToken);
  }
}

deleteAllUsers()
  .then(() => console.log('✅ All users deleted'))
  .catch((error) => console.error('❌ Error deleting users:', error));
