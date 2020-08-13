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

With that out of the way it's time for take-off!
You can either install the included systemd services and run `# systemctl start lewd2.service` which will launch all components. <br>
Alternatively if you're making your own solution or debugging, you can launch them individually:
```sh
node packages/main-site/dist/index.js
node packages/antivirus-services/dist/index.js
node packages/discord/dist/index.js
```

Now for serving static files for the frontend. For production see the next section regarding configuring NGINX. 
This, however, is not preferred for development and for that _NODE\_ENV_ can be set to _development_ which will cause the app itself to serve static files for the frontend.
**NOTE:** if in .env _PUBLIC_FOLDER_PATH_ is not set to _../../frontend/dist_ or at least a path to the frontend files the frontend will not have any styling or functionality

### Discord config

All that needs to be edited here is the BOT\_TOKEN which you can find by generating a bot [here](https://discord.com/developers/applications) after which you can find the token under Bot > Token. Other settings can be tweaked. The BOT_CHANNEL is where people go with their commands, APPLICATIONS_CHANNEL is where admins can apply or reject applicants, and of course the default upload size (which should be self explanatory really)

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