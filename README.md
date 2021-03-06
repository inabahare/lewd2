# lewd.se uploader

## Requirements
* NodeJS
* npm
* PostgreSQL

When using a non-LTS version of node the following dependencies may be needed to build bcrypt for password hashing

* Python 2.x
* make
* GCC or any other C/C++ compiler

More about it [here](https://www.npmjs.com/package/bcrypt#dependencies)

### Recommended
* A web server with reverse proxying
* A malware scanner

## Config
### Database
For simplicity we'll be using the default user and database.

First change the default users password:<br>
`$ sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'topsecret';"`

and import the template:<br>
`$ sudo -u postgres psql postgres < SQL/template.sql`

for the discord bot you'll also want to import that template:<br>
`$ sudo -u postgres psql postgres < SQL/discord_template.sql`

### Node
Copy **.env.dist** to **.env** and set `DB_PASSWORD` and `UPLOAD_DESTINATION` as a bare minimum.

Please take a moment to go through the different settings.

### Reverse proxy
[NGINX](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)

[Apache](https://httpd.apache.org/docs/2.4/howto/reverse_proxy.html)

## Discord bot

If desire discord bot integration you first need to go [here](https://discord.com/developers/applications) and create a new app. Nothing more is really needed under the General Information tab. Head over to the Bot tab and create a new bot. Give it a nice name and a good profile picture (or don't) and copy the token to BOT_TOKEN in the .env. 

Actualy adding the bot to the discord servicer is done by going to the OAuth2 tab and generate a new bot invite link which is so the bot can log in to your server. Under scopes select *bot* and in the box pick *Send Messages* and *embed links*. This will give you a link you can then (in a new tab mighyt be a good idea ) 

## Setup
Run `$ npm run setup` which will install all the needed dependencies and build the project.

## Running
Change the path and user in the included systemd service files and copy them to _/etc/systemd/system/_ <br>
Then you can simply run `# systemctl start lewd2.service`.

If you're making your own solution or just debugging, you can launch them individually, like so:<br>
`$ node packages/backend/dist/index.js`

At this point be able to log in with the credentials you set in _.env_ and you're ready for action.

