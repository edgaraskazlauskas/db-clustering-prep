## Database Weighted Graph Extraction tool

Extracts data from a Postgres database in format to be consumed by Gephi and used for clustering the database.

Sample usage:

```
node cli.js --dbname pagila --dbuser postgres --dbpassword postgres
```

To include weight adjustment:

```
node cli.js --dbname pagila --dbuser postgres --dbpassword postgres --weighted
```
