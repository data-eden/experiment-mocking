# GraphQL Tools Mocking

## Setup

This assumes we are using volta.

Install `ts-node`:

```sh
$ volta install ts-node
```

Run the demo (that includes a server) by running:

```sh
$ ts-node graphql-tools-mocking/index.ts
```

You should be able to see the result of the query that was executed directly.

This demo also includes a running server at http://0.0.0.0:4000/graphql which
is running GraphiQL. This allows you to explore the original schema while
querying with the same fake data.
