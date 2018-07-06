# Lewd.se uploader

## Requirements

### Install these
* NodeJS (Tested on 8.11.3)
* PostgreSQL
* NGINX

#### Optional
* yarn (npm alternative)

### Then run this command
```bash
# npm install pm2 -g
```
## Setup
First pull the repository

### Database
First open SQL/templates.sql and find this line
```sql
VALUES ('username here', 'password here', 'token here',
```
Then find a *username* for the first user. Then go here [here](https://www.dailycred.com/article/bcrypt-calculator) to generate a password, and then set the (upload) token. Save the file and type

```bash
$ sudo -i -u postgres 
```
Then log in to postgres with 

```bash
$ psql
```

and set the database password with

```bash
\password postgres
```

After that run

```sql
CREATE DATABASE ____;
```

with the underscores replaced with a database name. Then exit the database with **\q** and while still logged in as *postgres*, navigate to /where/you/clone/the/repo/SQL and run the following command

```bash
$ psql ____ <  template.sql
```

And you're done with the database. Type exit to log out of the postgres user and we can set up node

### Node

First rename **.env.dist** to **.env** and edit *DB_PASSWORD*, *DB_DATABASE* to the password and database you set previously. Also edit the *SITE DETAILS* so they're relevant. 

Save and then run the command 

```bash
$ npm install
```

to install all the dependencies and dev dependencies. When that's done run

```bash
$ npm run build:prod
```

to build the project. Then spin up the server with

```bash
$ pm2 start ecosystem.config.js
```

### NGINX

The bare minimum you need in _/etc/nginx/sites-available/default_ is the following:

```
server {
        listen 80 default_server;
        listen [::]:80 default_server;

        root /path/to/build/Public;

        server_name ____;

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