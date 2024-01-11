# 02-api-rest-nodejs

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Usage](#usage)
- [Contributing](../CONTRIBUTING.md)

## About <a name = "about"></a>

This is a project to study node. In here, we will be using typescript knex, sqlite, eslint, typescript and more. All of this is based on the rocketseat node course.

## Getting Started <a name = "getting_started"></a>

Just download the code to your local machine. To run the project, check [Getting Started](#getting_started). See [deployment](#deployment) for notes on how to deploy the project on a live system.

### Prerequisites

To run this code, you will need to have git, node and npm installed. In addiction, it's important to have the eslint plugin installed on your IDE.

### Installing

When running the first time, run:

```
npm run install
```

Then, after that you can run the project running:

```
npm run dev
```

## Usage <a name = "usage"></a>

### Knex 
Knex doesn't really work with typescript. To make it work, we created the database.ts file, which has the database configuration. To Run the migrations, we used the cli available in the node_modules package. We run the cli using node cli. You can check the *package.json* file to understante better.
- To create a new migration, run: ```npm run kex -- migrate:make <the name of your migration>```
- To run the lastest migration, run: ```npm run kex -- migrate:latest```
- If you want to undo your latest migration, run: ```npm run kex -- migrate:rollback```
