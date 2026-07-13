import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const database_name = "LandClearance.db";

export const getDBConnection = async () => {
  return SQLite.openDatabase(
    { name: database_name, location: 'default' }
  );
};

export const createTables = async (db: SQLite.SQLiteDatabase) => {
  const query = `
    CREATE TABLE IF NOT EXISTS drafts (
      id TEXT PRIMARY KEY,
      data TEXT,
      updatedAt TEXT
    );
    CREATE TABLE IF NOT EXISTS upload_queue (
      id TEXT PRIMARY KEY,
      listingId TEXT,
      localPhotoPaths TEXT,
      retryCount INTEGER DEFAULT 0,
      status TEXT DEFAULT 'pending'
    );
  `;
  await db.executeSql(query);
};

export const saveDraft = async (db: SQLite.SQLiteDatabase, id: string, data: any) => {
  const insertQuery = `INSERT OR REPLACE INTO drafts (id, data, updatedAt) VALUES (?, ?, ?)`;
  await db.executeSql(insertQuery, [id, JSON.stringify(data), new Date().toISOString()]);
};

export const getDrafts = async (db: SQLite.SQLiteDatabase) => {
  const results = await db.executeSql(`SELECT * FROM drafts`);
  const drafts: any[] = [];
  results.forEach((result: SQLite.ResultSet) => {
    for (let index = 0; index < result.rows.length; index++) {
      drafts.push(result.rows.item(index));
    }
  });
  return drafts;
};
