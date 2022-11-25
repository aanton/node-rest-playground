# Playground project for develop a REST API in Node.js

Just a personal project to play with the Node.js ecosystem.

## Packages & tools

List of packages used to build the REST API:

- [Express](https://expressjs.com/), a minimal and flexible Node.js web application
  - [body-parser](https://github.com/expressjs/body-parser), a parser middleware of incoming request bodies
  - [Morgan](https://github.com/expressjs/morgan), a HTTP request logger middleware
- [Sequelize](https://sequelize.org/), a promise-based Node.js ORM for SQLite & other relational databases
  - [sqlite3](https://github.com/mapbox/node-sqlite3), an asynchronous non-blocking [SQLite](https://sqlite.org/) bindings for Node.js
- [Lodash](https://lodash.com/), an library which provides utility functions for common programming tasks using the functional programming paradigm
- [DotEnv](https://github.com/motdotla/dotenv), a loader of environment variables from a `.env` file

List of packages & tools used during development:

- [Nodemon](https://nodemon.io/), an utility that monitors changes in source files & automatically restart the development server
- [@babel/node](https://babeljs.io/docs/en/next/babel-node.html), a CLI that works exactly the same as the Node.js CLI, with the added benefit of using [Babel](https://babeljs.io/), a toolchain to convert modern ECMAScript 2015+ code into a backwards compatible version of JavaScript
- [Jest](https://jestjs.io/), a testing framework that [supports Babel](https://github.com/facebook/jest#using-babel)
- [SuperTest](https://github.com/visionmedia/supertest), a library for testing Node.js HTTP servers using a fluent API
- [Falso](https://github.com/ngneat/falso), a generator of fake data

## Local installation

- Clone this repository
- Install dependencies
- Create the `.env` configuration using `.env.example` as a reference & fill all parameters properly
- Optionally seed the database with fake data

```bash
git clone https://github.com/aanton/node-rest-playground.git
cd node-rest-playground
npm install

# Optional step
npm run seed
```

## Scripts

### Run a local server

- Run a local server with live-reload functionality
- Optionally, use the [pre-defined HTTP requests](./resources/client.http) in the [vscode REST client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)

```bash
npm start
```

### Run tests

- Run the tests using an in-memory database
- Optionally, run the tests with a watcher to relaunch the tests when the code is modified

```bash
npm test
npm run test:watch
```

### Seed the database with fake data

- Recreate the database with fake data

```bash
npm run seed
```

## API

### Posts API

- `GET /api/posts/` gets all the posts
- `POST /api/posts/` creates a new post
- `GET /api/posts/:postId` gets a post with its comments & tags
- `PUT /api/posts/:postId` updates a post
- `DELETE /api/posts/:postId` deletes a post

### Post's comments API

- `GET /api/posts/:postId/comments` gets all the comments of a post
- `POST /api/posts/:postId/comments` creates a new comment in a post

### Comments API

- `GET /api/comments/` gets all the comments
- `GET /api/comments/search?q=[query]` searches comments
- `DELETE /api/comments/:commentId` deletes a comment

### Tags API

- `GET /api/tags/` gets all the tags
- `GET /api/tags/:tagIg` gets a tag with its posts
- `DELETE /api/tags/:tagIg` deletes a tag

## ToDo

- Implement pending tests & review code coverage
- Test-Driven development of new functionalities
  - Validation rules for comment fields
  - Validation rules for tag fields: slug must be unique
  - Generate tag slug autmatically
  - New route to get a tag by slug
  - Create a post with tags using tag names
  - Create a post with tags using tag identifiers
  - New post fields: text, publishedAt, URI (computed property)
- Fix duplicate `Post.findByPk` when getting a post
- Sequelize getters to have computed properties (e.g. permalink)
- Sequelize migrations
- Sequelize logging
- Remove timestamps from `PostTags` pivot table
- Deploying to a production server using [this approach](https://github.com/babel/example-node-server)
- Choose a free production server
- User model
- Authentication & authorization
- I+D micro-frameworks that fit to create REST APIs
