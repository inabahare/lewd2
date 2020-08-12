import { query } from "/Functions/database";

export class UpdatePasswordKeys {
  static async DeleteUsersKeys(userId) {
    await query(`DELETE FROM "UpdatePasswordKeys" WHERE "userId" = $1;`, [userId]);
  }
}