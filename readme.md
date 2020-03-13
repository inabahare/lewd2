# lewd.se uploader

## Requirements

* NodeJS
* npm
* PostgreSQL
* A webserver with reverse proxying (like NGINX)

### Recommended

* Sophos AV

## Setup

### Database
For simplicity we'll be using the default user and database.<br>
Don't do this in production, but hey I'm not your mum..

First change the default users password:
`$ sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'topsecret';"`<br>
and import the template
`$ sudo -u postgres psql postgres < /path/to/lewd2/SQL/template.sql`

### Node

Copy **.env.dist** to **.env** and edit the following

* DB_PASSWORD
* Everything under # Site details
* VIRUSTOTAL_KEY  
* VIRUSTOTAL_USER (This is the username of your virustotal account)

Then run `$ npm run setup` which will install all the needed dependencies and build the project. 

Now that that's done, it is time for us to start the server! `$ npm start`
This will launch the site using PM2 [More information on using PM2](https://pm2.keymetrics.io/)

Now for serving static files for the frontend. For production see the next section regarding configuring NGINX. 
This, however, is not preferred for development and for that _NODE\_ENV_ can be set to _development_ which will cause the app itself to serve static files for the frontend.
**NOTE:** if in .env _PUBLIC_FOLDER_PATH_ is not set to _../../frontend/dist_ or at least a path to the frontend files the frontend will not have any styling or functionality

### NGINX config

The bare minimum you need in _/etc/nginx/sites-available/default_ is the following:

```nginx
server {
        listen 80 default_server;
        listen [::]:80 default_server;

        root /path/to/lewd2/packages/frontend/dist;

        server_name ____;

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
If you would like to stop the application run `$ npm run stop`