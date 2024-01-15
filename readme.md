# Broadcaster

This is a sandbox project for developing a server, client and a mobile client application

## Build

The project uses environment files (dotenv) to configure the server, therefore right after clone these files are need to be created to 2 places

Main `.env` file in the `<project_root>/.env`

    MONGODB_USER=root
    MONGODB_PASSWORD=123456
    MONGODB_DATABASE=fullstack_db
    MONGODB_LOCAL_PORT=7017
    MONGODB_DOCKER_PORT=27017

    NODE_LOCAL_PORT=8080
    NODE_DOCKER_PORT=8080

    NODE_ENV="development"

Server `.env` file at path `<project_root>/server/.env` contains the secret which is used to JWT token generation

To generate your token, please run the following in Node: `require('crypto').randomBytes(64).toString('hex')` and pass the hash to the `.env` file

    TOKEN_SECRET=<generated_hash>

## Run

Run the server and the MongoDB

    docker compose up

## Resource

To create the project structure and Docker related configs

- <https://www.bezkoder.com/docker-compose-nodejs-mongodb/>

To handle MongoDB

- <https://www.mongodb.com/languages/express-mongodb-rest-api-tutorial>
- <https://github.com/mongodb-developer/mongodb-express-rest-api-example/blob/main/server/routes/posts.mjs>

JWT token generation and handling

- <https://www.digitalocean.com/community/tutorials/nodejs-jwt-expressjs>
- <https://github.com/auth0/express-jwt>

Password hashing for storing

- <https://blog.logrocket.com/building-a-password-hasher-in-node-js/>
- <https://github.com/Wisdom132/nodehasher/blob/master/user.routes.js>
