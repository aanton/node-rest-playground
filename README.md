# Playground project for develop a REST API in NodeJS

Just a personal project to play with NodeJS ecosystem:

- [Express](https://expressjs.com/), a minimal and flexible Node.js web application
- [Sequelize](https://sequelize.org/), a promise-based Node.js ORM for SQLite & other relational databases
- [@babel/node](https://babeljs.io/docs/en/next/babel-node.html), a CLI that works exactly the same as the Node.js CLI, with the added benefit of using [Babel](https://babeljs.io/), a toolchain to convert modern ECMAScript 2015+ code into a backwards compatible version of JavaScript
- [Nodemon](https://nodemon.io/), an utility that monitors changes in source files & automatically restart the development server
- [DotEnv](https://github.com/motdotla/dotenv), a loader of environment variables from a `.env` file
- [Lodash](https://lodash.com/), an library which provides utility functions for common programming tasks using the functional programming paradigm
- [Faker](http://marak.github.io/faker.js/), a generator of fake data

## Installation

- Clone this repository
- Install dependencies
- Create the `.env` configuration using `.env.example` as a reference & fill all parameters properly
- Create & seed the database

```bash
git clone https://github.com/aanton/node-rest-playground.git
cd node-rest-playground
npm install
npm run seed
```

## Playground

- Start the live-reload development server using `npm start`
- Load `postman/collection.json` in [Postman](https://www.postman.com/) & run the provided examples

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

- Fix duplicate `Post.findByPk` when getting a post
- Testing a REST API
- TDD when developing a REST API
- Sequelize getters to have computed properties (e.g. permalink)
- Sequelize migrations
- Sequelize logging
- Remove timestamps from `PostTags` pivot table
- Deploying to a production server using [this approach](https://github.com/babel/example-node-server)
- Choose a free production server
- User model
- Authentication & authorization
- I+D micro-frameworks that fit to create REST APIs
