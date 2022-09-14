| Command | Mean [s] | Min [s] | Max [s] | Relative |
|:---|---:|---:|---:|---:|
| `ts-node -T graphql-tools-mocking/benchmark.ts graphql-tools-mocking.graphql --no-server` | 1.522 ± 0.067 | 1.445 | 1.646 | 1.00 |
| `ts-node -T graphql-tools-mocking/benchmark.ts ts-deco-fe.federated.graphql --no-server` | 2.101 ± 0.031 | 2.067 | 2.160 | 1.38 ± 0.06 |
| `ts-node -T graphql-tools-mocking/benchmark.ts voyager-api.federated.graphql --no-server` | 2.773 ± 0.024 | 2.739 | 2.819 | 1.82 ± 0.08 |
