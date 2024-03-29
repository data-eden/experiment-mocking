import { makeExecutableSchema } from '@graphql-tools/schema';
import { addMocksToSchema } from '@graphql-tools/mock';
import { graphql } from 'graphql';
import { faker } from '@faker-js/faker';
import { createServer } from '@graphql-yoga/node';
import { getSampleSchema } from '../utils/get-sample-schema';

// Fill this in with the schema string
// This can be based on introspection too:
// https://www.graphql-tools.com/docs/mocking#mocking-a-schema-using-introspection
const schemaString = getSampleSchema();

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
  }
`;

graphql({
  schema: schemaWithMocks,
  source: query,
}).then((result) => {
  console.log('Got result %o', result);
});
