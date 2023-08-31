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
