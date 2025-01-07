# Install a (local) strapi-rpb instance for development using Docker
You will get an strapi instance with the content model for rpb provided.
User accounts and content entries are not included.

## Set up

### Install & set up Docker

#### Unix

[Install Docker Engine](https://docs.docker.com/engine/install/) by follwing the guide for your distro.

[Install Docker Compose](https://docs.docker.com/compose/install/linux/#install-using-the-repository) as a plugin.

Alternatively, you may want to use the Docker Desktop environment which includes a GUI and all Docker components.

#### Add your user to `docker` group

To execute docker commands without sudo, add your Unix user to the `docker` group, see https://docs.docker.com/engine/install/linux-postinstall/

### Clone repo

    $ git clone https://github.com/hbz/strapi-rpb.git
    $ cd strapi-rpb

### Add `.env` file

For starting the docker container you will need an `.env` file. You can use the example file:

    $ cp .env.example .env

## Development

For development on your local machine you can use Docker compose: 

    $ docker compose up

to spin up the two docker containers. The strapi app is accessible at `http://localhost:1337/`.

You first need to create an admin user via the GUI or [via the CLI](https://docs.strapi.io/dev-docs/cli#strapi-admincreate-user). (First, go into the container with `$ docker exec -it strapi-rpb bash`.)

In order to access the content-types through the [REST API](https://docs.strapi.io/dev-docs/api/rest) you need to set the appropriate permissions. Go to `http://localhost:1337/admin/settings/users-permissions/roles`, click on the respective role and set the permissions for each content-type. For more details please have a look at the [docs of the Users & Permissions plugin](https://docs.strapi.io/dev-docs/plugins/users-permissions).

### Plugin

To open a bash in your container (e.g. to use `strapi` CLI commands), run:

    $ docker exec -it strapi-rpb bash

To see changes made to the `lookup` plugin in your admin UI, run (in the project root directory):

    $ cd -
    $ strapi build

### Config

Some config (e.g. field labels) is actually stored in the DB, not in repo files.

It can be dumped to a file inside the container and copied to the local repo with:

    docker compose exec strapi-rpb strapi config:dump -f config.json
    docker compose cp strapi-rpb:./opt/app/config.json .

Reverse for restoring from the file:

    docker compose cp config.json strapi-rpb:./opt/app/
    docker compose exec strapi-rpb strapi config:restore -f config.json

The current config dump is checked into the repo as `config.json`. *Caution:* credentials (eg. API Tokens) will also be dumped into this file. Be sure your config contains non-sensitiv data only. In doubt you should not commit your config.

When running the restore command you can choose from different strategies: replace (default), merge, keep.

Read more in the [Strapi docs](https://docs.strapi.io/dev-docs/cli#strapi-configurationdump).

### Deployment

To deploy changes, go to the repo directory, pull the changes, and rebuild the container (`sudo docker compose down ; sudo docker compose -f docker-compose-prod.yml up -d --build`).

For details on our setup see https://dienst-wiki.hbz-nrw.de/display/SEM/RPB (internal).
