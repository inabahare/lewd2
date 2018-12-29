import db from "../../helpers/database";

export default async files => {
    const client = await db.connect();

    files.forEach(async file => {
        client.query("UPDATE \"Uploads\" SET deleted = TRUE WHERE id = $1;", [file.id]);
    });

    await client.release();
};