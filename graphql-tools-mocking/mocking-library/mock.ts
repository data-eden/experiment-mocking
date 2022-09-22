import { addMocksToSchema } from '@graphql-tools/mock';
import { mapSchema, MapperKind } from '@graphql-tools/utils';
import { randNumber, randSoonDate, randWord } from '@ngneat/falso';
import { defaultFieldResolver, graphql, visit, parse } from 'graphql';
import { MockingLibraryExperiment } from './library';

export class MockExperiment {
  private _providedData: Record<string, unknown>;

  constructor(
    private config: {
      library: MockingLibraryExperiment;
      query: string;
      providedData?: Record<string, unknown>;
    }
  ) {
    this._providedData = this.config.providedData ?? {};
  }

  set(providedData: Record<string, unknown>): MockExperiment {
    Object.assign(this._providedData, providedData);
    return this;
  }

  getPayload() {
    const {
      config: {
        query,
        library: { baseSchema },
      },
    } = this;

    if (!baseSchema) {
      throw new Error(`Expected the baseSchema to be defined`);
    }

    const mockedSchema = addMocksToSchema({
      schema: baseSchema,
      mocks: {
        [this._getQueryName()]: () => this._providedData,
        Date: () => randSoonDate(),
        String: () => randWord(),
        Number: () => randNumber(),
        Int: () => randNumber(),
        Float: () => randNumber(),
        Boolean: () => false,
      },
    });

    const mappedSchema = mapSchema(mockedSchema, {
      [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
        const { resolve = defaultFieldResolver } = fieldConfig;

        return {
          ...fieldConfig,
          resolve: async function (source, args, context, info) {
            const result = await resolve(source, args, context, info);

            // TODO: custom validation here (throw an error if invalid);
            // e.g., validation based on custom directives

            return result;
          },
        };
      },
    });

    return graphql({
      schema: mappedSchema,
      source: query,
    });
  }

  private _getQueryName() {
    const ast = parse(this.config.query);
    let queryName: string | undefined;

    visit(ast, {
      OperationDefinition: (node) => {
        queryName = node?.name?.value ?? queryName;
      },
    });

    if (typeof queryName !== 'string') {
      throw new Error('Could not find a query name from the provided query');
    }

    return queryName;
  }
}
