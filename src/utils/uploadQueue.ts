import storage from '@react-native-firebase/storage';
import { getDBConnection } from './database';
import NetInfo from '@react-native-community/netinfo';
import firestore from '@react-native-firebase/firestore';

export const MAX_RETRIES = 5;

export const addToUploadQueue = async (listingId: string, localPaths: string[]) => {
  const db = await getDBConnection();
  const id = `queue_${Date.now()}`;
  const query = `INSERT INTO upload_queue (id, listingId, localPhotoPaths, status, retryCount) VALUES (?, ?, ?, 'PENDING', 0)`;
  await db.executeSql(query, [id, listingId, JSON.stringify(localPaths)]);
};

export const processUploadQueue = async () => {
  const state = await NetInfo.fetch();
  if (!state.isConnected) return;

  const db = await getDBConnection();
  const results = await db.executeSql(`SELECT * FROM upload_queue WHERE status IN ('PENDING', 'RETRYING')`);
  
  const queueItems: any[] = [];
  results.forEach((result: any) => {
    for (let index = 0; index < result.rows.length; index++) {
      queueItems.push(result.rows.item(index));
    }
  });

  for (const item of queueItems) {
    if (item.retryCount >= MAX_RETRIES) {
      await db.executeSql(`UPDATE upload_queue SET status = 'FAILED' WHERE id = ?`, [item.id]);
      continue;
    }

    try {
      await db.executeSql(`UPDATE upload_queue SET status = 'UPLOADING' WHERE id = ?`, [item.id]);
      
      const paths = JSON.parse(item.localPhotoPaths);
      const uploadedPaths: string[] = [];

      for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        const filename = path.substring(path.lastIndexOf('/') + 1);
        const storagePath = `listings/${item.listingId}/originals/${filename}`;
        const ref = storage().ref(storagePath);
        await ref.putFile(path);
        uploadedPaths.push(storagePath);
      }

      await firestore()
        .collection('listings')
        .doc(item.listingId)
        .update({
          originals: firestore.FieldValue.arrayUnion(...uploadedPaths)
        });

      await db.executeSql(`UPDATE upload_queue SET status = 'COMPLETED' WHERE id = ?`, [item.id]);
    } catch (err) {
      console.error('Upload failed for item', item.id, err);
      const newRetryCount = item.retryCount + 1;
      const nextStatus = newRetryCount >= MAX_RETRIES ? 'FAILED' : 'RETRYING';
      
      // Exponential backoff logic would be handled by delaying the next call to processUploadQueue
      // based on retryCount. For now, we increment the count and status.
      await db.executeSql(`UPDATE upload_queue SET status = ?, retryCount = ? WHERE id = ?`, [nextStatus, newRetryCount, item.id]);
    }
  }
};

