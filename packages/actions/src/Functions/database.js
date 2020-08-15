import { database } from "/helpers/database";

/**
 * Query the database returning the rows or null if none found
 * @param {string} sql 
 * @param {Array} params 
 */
export async function query(sql, params = null) {
  const client = await database.connect();
  const data = await client.query(sql, params);
  client.release();

  if (data.rows.length === 0)
    return null;

  return data.rows;
}