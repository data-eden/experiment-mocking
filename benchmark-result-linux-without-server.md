| Command | Mean [s] | Min [s] | Max [s] | Relative |
|:---|---:|---:|---:|---:|
| `ts-node -T graphql-tools-mocking/benchmark.ts graphql-tools-mocking.graphql --no-server` | 2.645 ± 0.037 | 2.596 | 2.701 | 1.00 |
| `ts-node -T graphql-tools-mocking/benchmark.ts ts-deco-fe.federated.graphql --no-server` | 3.651 ± 0.060 | 3.584 | 3.749 | 1.38 ± 0.03 |
| `ts-node -T graphql-tools-mocking/benchmark.ts voyager-api.federated.graphql --no-server` | 5.238 ± 0.070 | 5.131 | 5.358 | 1.98 ± 0.04 |
