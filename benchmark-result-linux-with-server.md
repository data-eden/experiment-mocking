| Command | Mean [s] | Min [s] | Max [s] | Relative |
|:---|---:|---:|---:|---:|
| `ts-node -T graphql-tools-mocking/benchmark.ts graphql-tools-mocking.graphql` | 2.735 ± 0.071 | 2.657 | 2.890 | 1.00 |
| `ts-node -T graphql-tools-mocking/benchmark.ts ts-deco-fe.federated.graphql` | 3.785 ± 0.052 | 3.708 | 3.888 | 1.38 ± 0.04 |
| `ts-node -T graphql-tools-mocking/benchmark.ts voyager-api.federated.graphql` | 5.238 ± 0.081 | 5.134 | 5.392 | 1.92 ± 0.06 |
