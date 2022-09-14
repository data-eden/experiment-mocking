import { makeExecutableSchema } from '@graphql-tools/schema';
import { addMocksToSchema } from '@graphql-tools/mock';
import { graphql } from 'graphql';
import { faker } from '@faker-js/faker';
import { createServer } from '@graphql-yoga/node';
import fs from 'node:fs';
import path from 'node:path';

// Fill this in with the schema string
// This can be based on introspection too:
// https://www.graphql-tools.com/docs/mocking#mocking-a-schema-using-introspection
const schemaString = fs.readFileSync(
  path.join('schemas', 'graphql-tools-mocking.graphql'),
  'utf-8'
);

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
        // this throws error which means there is schema validation against mocks
        // bla: 'example',
      };
    },

    Query: {
      books: () => {
        // we can't get the input args from the query 😞
        return [...new Array(faker.datatype.number({ min: 2, max: 6 }))];
      },
    },
  },
});

// optionally we can serve the schema in the network
const server = createServer({
  schema: schemaWithMocks,
});

server.start();

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
