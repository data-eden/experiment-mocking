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

## Benchmark

Install hyperfine with brew or similar:

```sh
$ brew install hyperfine
```

Copy the schemas that you want to test against to `schemas/` folder.

Run the tests in your environment and export it to MD file like:

```sh
$ hyperfine --warmup 3 -r 10 \
  'ts-node -T graphql-tools-mocking/benchmark.ts graphql-tools-mocking.graphql' \
  'ts-node -T graphql-tools-mocking/benchmark.ts <api-1>.graphql' \
  'ts-node -T graphql-tools-mocking/benchmark.ts <api-2>.graphql' \
  --export-markdown benchmark-result-<architecture>-<with-server/without-server>.md
```

If you want to test without booting the GQL server - currently using
[Yoga](https://www.the-guild.dev/graphql/yoga-server) - use the `--no-server`
option:

```sh
$ hyperfine --warmup 3 -r 10 \
  'ts-node -T graphql-tools-mocking/benchmark.ts graphql-tools-mocking.graphql --no-server' \
  'ts-node -T graphql-tools-mocking/benchmark.ts <api-1>.graphql --no-server' \
  'ts-node -T graphql-tools-mocking/benchmark.ts <api-2>.graphql --no-server' \
  --export-markdown benchmark-result-<architecture>-<with-server/without-server>.md
```
