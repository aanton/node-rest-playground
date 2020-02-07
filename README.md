# Playground project for develop a REST API in NodeJS

Just a personal project to play with NodeJS ecosystem:
- [Express](https://expressjs.com/), a minimal and flexible Node.js web application
- [Sequelize](https://sequelize.org/), a promise-based Node.js ORM for SQLite & other relational databases
- [@babel/node](https://babeljs.io/docs/en/next/babel-node.html), a CLI that works exactly the same as the Node.js CLI, with the added benefit of using [Babel](https://babeljs.io/), a toolchain to convert modern ECMAScript 2015+ code into a backwards compatible version of JavaScript
- [Nodemon](https://nodemon.io/), an utility that monitors changes in source files & automatically restart the development server
- [DotEnv](https://github.com/motdotla/dotenv), a loader of environment variables from a `.env` file
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
- Load `postman.json` in [Postman](https://www.postman.com/) & run the provided requests
