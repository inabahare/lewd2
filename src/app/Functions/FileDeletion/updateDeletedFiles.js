import { DbClient } from "../../helpers/database";

export default async files => {
    const client = DbClient();
    await client.connect();

    files.forEach(async file => {
        client.query("UPDATE \"Uploads\" SET deleted = TRUE WHERE id = $1;", [file.id]);
    });

    await client.end();
};