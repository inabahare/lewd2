# How to set up
### What you need to install

1. Nginx
1. NodeJS and NPM (tested on 10.5.0)
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
$ npm install pm2 -g
$ yarn global add pm2
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

And now we're ready to import the tables into the database. Type \q and navigate to the apps project folder and they will be inside the SQL folder. From inside the SQL folder tun the following commands

```shell
$ psql db < Roles.sql
$ psql db < Tokens.sql  
$ psql db < Uploads.sql 
$ psql db < Users.sql
```

Now there's one final thing you need to do, and that is connect to the database by running this command

```shell
psql -d db
```

And finally you need to run this command

```sql
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO user;
```

And the database has been set up. You can now type \q to exit the postgres shell, and exit to go back the regular shell. With the database set up we're ready to configure NGINX

### NGINX

## Starting the app