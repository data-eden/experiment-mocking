import { makeExecutableSchema } from '@graphql-tools/schema';
import { addMocksToSchema } from '@graphql-tools/mock';
import { graphql } from 'graphql';
import { faker } from '@faker-js/faker';
import { createServer } from '@graphql-yoga/node';
import fs from 'fs';
import path from 'path';
import sanitize from 'sanitize-filename';

const options = { withServer: true };
const inputs: string[] = [];
process.argv.slice(2).forEach((arg) => {
  switch (arg) {
    case '--no-server':
      options.withServer = false;
      break;
    default:
      inputs.push(arg);
  }
});

const providedSchemaPath = inputs[0];

const providedSchema = fs.readFileSync(
  path.join('schemas', sanitize(providedSchemaPath)),
  'utf-8'
);
const extendedSchema = fs
  .readFileSync(path.join('schemas', 'graphql-tools-mocking.graphql'), 'utf-8')
  // extend query since other schema above has it already defined
  .replace('type Query {', 'extend type Query {');

const schemaString = `
${providedSchema}
${extendedSchema}
`;

// Make a GraphQL schema with no resolvers
const schema = makeExecutableSchema({ typeDefs: schemaString });

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
      };
    },

    Query: {
      books: () => {
        // always load only 1 for consistent benchmark results
        return [...new Array(1)];
      },
    },
  },
});

if (options.withServer) {
  // benchmark with optional GQL server
  const server = createServer({
    schema: schemaWithMocks,
  });

  server.start().then(() => {
    // stop the server after we start for clean exit of the process
    server.stop();
  });
}

const query = /* GraphQL */ `
  query Book {
    book(id: 6) {
      id
      description
      date
      author {
        id
        firstName
        lastName
        fullName
      }
    }

    # this limit input is ignored by the mocker
    books(limit: 1) {
      id
      description
      date
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
  schema: schemaWithMocks,
  source: query,
}).then((result) => {
  console.log('Got result %o', result);
});
