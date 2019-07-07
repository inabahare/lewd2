# lewd.se uploader

## Requirements

* NodeJS (Tested on 10.15.2)
* npm (Tested on 5.8.0)
* PostgreSQL (Tested on 11.4)
* A webserver with reverse proxying (Tested on NGINX 1.14.2)
* Sophos AV

## Setup

First pull this repository and install pm2

`# npm install pm2 -g`

### Database

First you should change the default users password. This is easily done by executing psql as the postgres user

`$ sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'topsecret';"`

like so, then we'll proceed to import the template

`$ sudo -u postgres psql postgres < /path/to/lewd2/SQL/template.sql`

And you're done with the database!

### Node

Copy **.env.dist** to **.env** and edit the following

* DB_PASSWORD
* Everything under # Site details
* VIRUSTOTAL_KEY  
* VIRUSTOTAL_USER (This is the username of your virustotal account)

to suit your needs.

Then run `$ npm install` to install all the dependencies followed by actually building the project with `$ npm run build`. 

Now that that's done, it is time for us to start the server! `$ pm2 start ecosystem.config.js`  
[More information on using PM2](https://pm2.keymetrics.io/)

### NGINX config

The bare minimum you need in _/etc/nginx/sites-available/default_ is the following:

```nginx
server {
        listen 80 default_server;
        listen [::]:80 default_server;

        root /path/to/lewd2/Public;

        server_name ____;

        # Change this if larger files should be uploaded. Setting it to 0 will disable the check entirely.
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

## All done

Everything should be operational at this point and you can log in with the default user and password admin (in both fields).

