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
- Load `postman.json` in [Postman](https://www.postman.com/) & run the provided examples

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
