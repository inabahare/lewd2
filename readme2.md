# How to set up
### What you need to install

1. Nginx
1. NodeJS and NPM (tested on 8.11.3 and 10.5.0)
    * Optionally you could install and use yarn instead of NPM
1. PostgreSQL

After having installed these you need to clone the repo (and bascially put it wherever you want to) and we can move on to the individual parts.

### Node

After having cloned the repo you need to install the dependencies for this project. This is done by running either commands in the websites root directory:

```shell
$ npm install
$ yarn install
```

After that all dependencies and dev dependencies will be installed. After that you need to install a global module called PM2. This is done by running either of the following commands:

```shell
# npm install pm2 -g
# yarn global add pm2
```

### PostgreSQL

To configure the we first need to log in to the default user created by Postgres and connect to Postgres

```shell
$ sudo -i -u postgres
$ psql
```

You will now see something like this

```
psql (10.4 (Ubuntu 10.4-0ubuntu0.18.04))
Type "help" for help.

postgres=#
```

Now we need to create a a database for the app, and a user. That is done by typing the following commands (with *db*,and *user* replaced by the database name, the username for the app)

```sql
CREATE USER user WITH ENCRYPTED PASSWORD 'password';
CREATE DATABASE db;
GRANT ALL PRIVILEGES ON DATABASE db TO user;
```

And now you should end up with something like this:

```sql
CREATE USER user WITH ENCRYPTED PASSWORD 'password';
CREATE ROLE
CREATE DATABASE db;
CREATE DATABASE
GRANT ALL PRIVILEGES ON DATABASE db TO user;
GRANT
```

And now we're ready to import the tables into the database. Type \q and navigate to the apps project folder and they will be inside the SQL folder. From inside the SQL folder start by opening up Users.sql where there will be an insert statement on line 36. Where it says 
```sql 
VALUES ('username', 'password'
``` 
insert a username for the first user where it says username, and then go  https://www.dailycred.com/article/bcrypt-calculator to generate a password and insert it where it says password. Save the file and then (logged in as psql) run the following commands:

```shell
$ psql _db_ < template.sql
```

Now there's one final thing you need to do, and that is connect to the database by running this command

```shell
psql -d db
```

And finally you need to run the following commands

```sql
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO _user_;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO _user_;
```

And the database has been set up. You can now type \q to exit the postgres shell, and exit to go back the regular shell. With the database set up we're ready to configure NGINX

### NGINX
The bare minimum you need in _/etc/nginx/sites-available/default_ is the following:

```
server {
        listen 80 default_server;
        listen [::]:80 default_server;

        root /path/to/build/Public;

        server_name _name_;

        client_max_body_size 5g;

        gzip on;
        location / {
                try_files $uri @backend;
        }

        location @backend {
                proxy_pass http://localhost:8080;
        }
}
```

Where of course, client_max_body_size should be changed if larger files should be uploaded. Setting it to 0 will disable the check, but will also allow people to upload infinitely large files

## Starting the app
First rename the **.env.dist** file to **.env**, then open that file and set the database details as well as the *SITE_NAME*, *UPLOAD_DESTINATION*, and *UPLOAD_LINK*. After that is done the app needs to be build, which is done by running:

```bash
$ npm run build:prod
$ yarn run build:prod
```
When that is done you're ready to run the site, which is done by running the following command:

```bash
pm2 start ecosystem.config.js
```
