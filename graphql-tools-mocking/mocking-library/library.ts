import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLSchema } from 'graphql';
import { MockExperiment } from './mock';

export class MockingLibraryExperiment {
  private _baseSchema: GraphQLSchema | undefined;

  constructor({ schema }: { schema: string }) {
    this.initGraphQLToolsMocking(schema);
  }

  get baseSchema() {
    return this._baseSchema;
  }

  initGraphQLToolsMocking(schemaString: string) {
    this._baseSchema = makeExecutableSchema({ typeDefs: schemaString });
  }

  mockGraphQLQuery(query: string, providedData?: Record<string, unknown>) {
    return new MockExperiment({ library: this, query: query, providedData });
  }
}
