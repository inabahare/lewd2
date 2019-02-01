# lewd.se uploader


## Requirements
* NodeJS (Tested on 10.15.0)
* PostgreSQL (Tested on 9.6)
* A webserver with reverse proxying (Tested on NGINX 1.10.3)
* Sophos AV
* g++ (Tested on 6.3.0)

#### Optional
* yarn (npm alternative)


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
* VIRUSTOTAL_USER (This is the username of your virustotal account (yes it is needed))

to suit your needs.

Save and then run the command `$ npm install` to install all the dependencies.


Assuming nothing went wrong you can now build the project with `$ npm run build` and spin up the server

`$ pm2 start ecosystem.config.js`


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

Now when it's all set up you're ready. You can go to your domain and log in with admin and admin as username and password.

# Starting, stopping, and monitoring 
More can be found [here](http://pm2.keymetrics.io/)

```bash
$ pm2 start ecosystem.config.js
$ pm2 stop all
$ pm2 monit
```
