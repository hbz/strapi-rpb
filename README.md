# Install a (local) strapi-rpb instance for development using Docker
You will get an strapi instance with the content model for rpb provided.
User accounts and content entries are not included.

## Set up

### Install Docker

#### Unix

[Install Docker Engine](https://docs.docker.com/engine/install/) by follwing the guide for your distro.

[Install Docker Compose](https://docs.docker.com/compose/install/linux/#install-using-the-repository) as a plugin.

Alternatively, you may want to use the Docker Desktop environment which includes a GUI and all Docker components.

### Clone repo

    $ git clone https://github.com/hbz/strapi-rpb.git
    $ cd strapi-rpb

## Development

For development on your local machine you can use Docker compose: 

    $ docker compose up

to spin up the two docker containers. The strapi app is accessible at `http://localhost:1339/`. The standard port 1337 strapi normally uses is mapped to 1339 on the host, see `docker-compose.yml`.

You first need to create an admin user via the GUI or [via the CLI](https://docs.strapi.io/dev-docs/cli#strapi-admincreate-user).

In order to access the content-types through the [REST API](https://docs.strapi.io/dev-docs/api/rest) you need to set the appropriate permissions. Go to `http://localhost:1339/admin/settings/users-permissions/roles`, click on the respective role and set the permissions for each content-type. For more details please have a look at the [docs of the Users & Permissions plugin](https://docs.strapi.io/dev-docs/plugins/users-permissions).

### Plugin

To open a bash in your container (e.g. to use `strapi` CLI commands), run:

    $ docker exec -it strapi-rpb bash

The plugin is a node application in `src/plugins/lookup`, i.e. you can run `npm` commands there:

    $ cd src/plugins/lookup
    $ npm install

To see changes made to the `lookup` plugin in your admin UI, run (in the project root directory):

    $ cd -
    $ strapi build
