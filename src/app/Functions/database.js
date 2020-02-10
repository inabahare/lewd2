import { db } from "../helpers/database";


async function query(sql, params = null) {
  const client = await db.connect();
  const data = client.query(sql, params);
  client.release();

  if (data.rows.lengt === 0) 
    return null;

  return data.rows;
}

export { query };