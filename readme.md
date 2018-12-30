# Lewd.se uploader

## Requirements

### Install these
* NodeJS (Tested on 10.14.2)
* PostgreSQL (Tested on 9.6)
* A webserver with reverse proxying (Tested on NGINX 1.10.3)
* Sophos AV
* g++ (Tested on 7.3.0)

#### Optional
* yarn (npm alternative)

## Setup
First pull this repository and install pm2
```bash
# npm install pm2 -g
```

### Database
First you should change the default users password. This is done by first switching to the postgres user

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

 Then exit the database with **\q** and while still logged in as *postgres*, navigate to /where/you/clone/the/repo/SQL and run the following command

```bash
$ psql postgres <  template.sql
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

### NGINX config 

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

## When you're done

Now when it's all set up you're ready you can go to your domain and log in with admin and admin as username and password