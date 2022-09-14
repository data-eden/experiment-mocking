| Command | Mean [s] | Min [s] | Max [s] | Relative |
|:---|---:|---:|---:|---:|
| `ts-node -T graphql-tools-mocking/benchmark.ts graphql-tools-mocking.graphql` | 1.493 ± 0.068 | 1.443 | 1.672 | 1.00 |
| `ts-node -T graphql-tools-mocking/benchmark.ts ts-deco-fe.federated.graphql` | 2.200 ± 0.082 | 2.127 | 2.356 | 1.47 ± 0.09 |
| `ts-node -T graphql-tools-mocking/benchmark.ts voyager-api.federated.graphql` | 2.813 ± 0.062 | 2.750 | 2.949 | 1.88 ± 0.09 |
