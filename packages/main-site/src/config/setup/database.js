import { query } from "/Functions/database";
import debug from "debug";
import bcrypt from "bcrypt";
import { v1 as uuid } from "uuid";



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

        if (!user) {
            const passwordHashed = await bcrypt.hash(process.env.ADMIN_DEFAULT_PASSWORD, parseInt(process.env.BCRYPT_SALT_ROUNDS));
            
            this.AdminLog("Adding admin");
            
            const data = [
                process.env.ADMIN_DEFAULT_USERNAME,
                passwordHashed,
                uuid(),
                process.env.ADMIN_DEFAULT_UPLOAD_SIZE,
                true
            ];

            await query(`INSERT INTO "Users" (username, password, token, uploadsize, isadmin)
                            VALUES ($1, $2, $3, $4, $5);`, data);
            this.AdminLog(`Admin added with '${process.env.ADMIN_DEFAULT_PASSWORD}' as password`);
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