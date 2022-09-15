import { makeExecutableSchema } from '@graphql-tools/schema';
import { addMocksToSchema } from '@graphql-tools/mock';
import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';
import { graphql, GraphQLSchema, defaultFieldResolver } from 'graphql';
import { faker } from '@faker-js/faker';
import { createServer } from '@graphql-yoga/node';

// Fill this in with the schema string
// This can be based on introspection too:
// https://www.graphql-tools.com/docs/mocking#mocking-a-schema-using-introspection
const schemaString = `
  scalar Date

  type Book {
    id: ID!
    description: String
    date: Date
    author: BookAuthor
    urn: String @urn(type: "foo", fields: [{ name: "first" }, { name: "last" }])
  }

  type BookAuthor {
    id: ID!
    firstName: String
    lastName: String
    fullName: String
  }

  type Query {
    book(id: ID!): Book
    books(limit: Int, skip: Int, sort_field: String, sort_order: String): [Book]
  }

  type Mutation {
    createBook(body: String): Book
    deleteBook(id: ID!): Book
  }
`;

let id = 1;

function idGenerator() {
  return id++;
}

function urnDirective(schema: GraphQLSchema): GraphQLSchema {
  const directiveName = 'urn';

  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const urnDirectiveArgs = getDirective(
        schema,
        fieldConfig,
        directiveName
      )?.[0] as
        | {
            type: string;
            fields?: [];
          }
        | undefined;

      if (urnDirectiveArgs) {
        const { resolve = defaultFieldResolver } = fieldConfig;

        return {
          ...fieldConfig,
          resolve: async function (source, args, context, info) {
            const result = await resolve(source, args, context, info);

            if (typeof result === 'string') {
              const { type, fields = [] } = urnDirectiveArgs;

              const baseUrn = `unique_urn_with_parts_${type}`;

              if (fields.length) {
                return `${baseUrn}:(${fields.map(() => idGenerator())})`;
              }

              return baseUrn;
            }

            return result;
          },
        };
      }
    },
  });
}

const urnDirectiveTypeDef = () => `
  directive @urn(type: String!, fields: [FieldMetadata!]) on FIELD_DEFINITION

  input FieldMetadata {
    name: String
  }
`;

// Make a GraphQL schema with no resolvers
const schema = makeExecutableSchema({
  typeDefs: [schemaString, urnDirectiveTypeDef()],
});

// Create a new schema with mocks
const schemaWithMocks = addMocksToSchema({
  schema,
  mocks: {
    Date: () => new Date().toISOString(),

    BookAuthor: () => {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      return {
        firstName,
        lastName,
        fullName: faker.name.fullName({ firstName, lastName }),
        // this throws error which means there is schema validation against mocks
        // bla: 'example',
      };
    },
  },
});

const schemaWithUrnDirective = urnDirective(schemaWithMocks);

// optionally we can serve the schema in the network
const server = createServer({
  schema: schemaWithUrnDirective,
});

server.start();

const query = /* GraphQL */ `
  query Book {
    book(id: 6) {
      id
      description
      date
      urn
      author {
        id
        firstName
        lastName
        fullName
      }
    }
  }
`;

graphql({
  schema: schemaWithUrnDirective,
  source: query,
}).then((result) => {
  console.log('Got result %o', result);
});
