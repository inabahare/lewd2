# lewd.se uploader

## Now in Docker

### How to start it?
Download and install docker and docker-compose to your server

Clone repository

Copy **.env.dist** to **.env** in node_app directory and set `DB_PASSWORD` (same as POSTGRES_PASSWORD in docker-compose.yml) and `UPLOAD_DESTINATION` as a bare minimum.

Please take a moment to go through the different settings.

## HTTPS cert installation
Prepare nginx config by replacing 'example.com' with your domain name

Make an appropriate DNS record on your DNS panel

Then make a one-shot run of certbot in order to generate certificates, run next command:

`docker-compose run --rm certbot certonly --webroot-path /var/www/certbot/ -d test2.panov.dev`

if your 80 or 443 port is busy by something else, try different method (for example if you already have some container/service listening on 80 port)

`docker-compose run --rm certbot certonly --manual --preferred-challenges dns --webroot-path /var/www/certbot/ -d test2.panov.dev`

Now, launch all containers together

`docker-compose up -d`

Note that first run will take some time because of creating a build for frontend/backend.

If nginx containers has started - everything is good!

Make sure that 'postgres', 'node' and 'nginx' containers are running:
`docker ps`


