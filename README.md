# North News API

The api can be accessed at <https://northnews.herokuapp.com/api>.

## Summary

North News API mimics a real world backend service (such as reddit) which stores data in a PSQL database and provides this information to the front end architecture in JSON format.

## Setting up your project

### Step 1: Cloning the project to your local machine

Clone the project to your local machine using `git` by executing the following command:

```
git clone https://github.com/magarpratik/be-nc-news.git
```

### Step 2: Installing the required dependencies

Install all the required dependencies by executing the following `npm` command in the project root:

```
npm install
```

### Step 3: Setting up the database

First, create the local database by running the script `setup-dbs` as shown below:

```
npm run setup-dbs
```

Then, run the following script to seed the database:

```
npm run seed
```

### Step 4: Creating the `.env` files

You will need to create _two_ `.env` files for your project: `.env.test` and `.env.development`. Into each, add `PGDATABASE=<database_name_here>`, with the correct database name for that environment (see `/db/setup.sql` for the database names). Double check that these `.env` files are .gitignored.

## Running the tests

To run the tests, execute the following script:

```
npm test
```

## Minimum requirements

Node.js: v16.11.1

Postgres: 14.1
