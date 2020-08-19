# lewd.se uploader

## Requirements
* NodeJS
* npm
* PostgreSQL

### Recommended
* A web server with reverse proxying
* A malware scanner

## Config
### Database
For simplicity we'll be using the default user and database.

First change the default users password:
`$ sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'topsecret';"`

and import the template
`$ sudo -u postgres psql postgres < SQL/template.sql`

### Node
Copy **.env.dist** to **.env** and set `DB_PASSWORD` and `UPLOAD_DESTINATION` as a bare minimum.

Please take a moment to go through the different settings.

### Reverse proxy
[NGINX](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)

[Apache](https://httpd.apache.org/docs/2.4/howto/reverse_proxy.html)

## Setup
Run `$ npm run setup` which will install all the needed dependencies and build the project.

## Running
Change the path and user in the included systemd service files and copy them to _/etc/systemd/system/_ <br>
Then you can simply run `# systemctl start lewd2.service`.

If you're making your own solution or debugging, you can launch them individually, like so: `node packages/main-site/dist/index.js`

At this point be able to log in with the credentials you set in _.env_ and you're ready for action.
