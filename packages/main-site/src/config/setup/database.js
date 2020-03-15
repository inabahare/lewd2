import { User } from "/DataAccessObjects";

class Database {
    /**
     * Runs all the database setup stuff
     */
    static async SetUp() {
        await this.AddAdmin();
    }

    static async AddAdmin() {
        const userExists = await User.CheckIfUserExists(process.env.ADMIN_DEFAULT_USERNAME);
        
        if (userExists) {
            return;
        }

        await User.Create({
            username: process.env.ADMIN_DEFAULT_USERNAME,
            password: process.env.ADMIN_DEFAULT_PASSWORD,
            uploadSize: process.env.ADMIN_DEFAULT_UPLOAD_SIZE,
            isAdmin: true
        });
    }
}

export { Database };

// ADMIN_DEFAULT_USERNAME = admin
// ADMIN_DEFAULT_PASSWORD = admin
// ADMIN_DEFAULT_UPLOAD_SIZE = 10000000
// ADMIN_DEFAULT_TOKEN = default