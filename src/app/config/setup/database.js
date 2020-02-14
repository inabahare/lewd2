import { query } from "../../Functions/database";
import debug from "debug";
import bcrypt from "bcrypt";
import uuid from "uuid/v1";



class Database {
    /**
     * Runs all the database setup stuff
     */
    static async SetUp() {
        await this.AddAdmin();
    }

    static async AddAdmin() {
        this.AdminLog("Checking if admin exists");
        const user = await query(`SELECT username FROM "Users" WHERE username = $1;`, [ process.env.ADMIN_DEFAULT_USERNAME ]);

        if (user.rows[0] == null) {
            try {
                const passwordHashed = await bcrypt.hash(process.env.ADMIN_DEFAULT_PASSWORD, parseInt(process.env.BCRYPT_SALT_ROUNDS));
                
                this.AdminLog("Adding admin");
                await query(`INSERT INTO "Users" (username, password, token, uploadsize, isadmin)
                                    VALUES ($1, $2, $3, $4, $5);`, [
                    process.env.ADMIN_DEFAULT_USERNAME,
                    passwordHashed,
                    uuid(),
                    process.env.ADMIN_DEFAULT_UPLOAD_SIZE,
                    true
                ]);
                this.AdminLog(`Admin added with '${process.env.ADMIN_DEFAULT_PASSWORD}' as password`);
            } 
            catch (e) {
                this.AdminLog("Failed to add default user");
                this.AdminLog(e.message);
            }
        }
        else {
            this.AdminLog("Admin already exists");
        }
    }

    static AdminLog(message) {
        debug("Database")(message);
    }
}

export { Database };

// ADMIN_DEFAULT_USERNAME = admin
// ADMIN_DEFAULT_PASSWORD = admin
// ADMIN_DEFAULT_UPLOAD_SIZE = 10000000
// ADMIN_DEFAULT_TOKEN = default