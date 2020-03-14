import { query } from "../../Functions/database";

export default async files => {
    files.forEach(file => {
        query("UPDATE \"Uploads\" SET deleted = TRUE WHERE id = $1;", [file.id]);
    });
};