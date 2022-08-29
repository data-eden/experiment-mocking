import { GraphQLHandler, embed } from "graphql-mocks";
import { spyWrapper } from "@graphql-mocks/sinon";
import { falsoMiddleware } from '@graphql-mocks/falso';
import fs from 'fs'
import path from 'path'

// this string represents our schema formatted in
// GraphQL SDL (Schema Definition Language), but
// a GraphQL Instance or SDL String can be used
const graphqlSchema = fs.readFileSync(
  path.resolve(__dirname, 'schema.gql')
).toString()


const handler = new GraphQLHandler({
  resolverMap: {
    Query: {
      // Example for using arguments to ensure field matches query
      book: (parent, args) => ({ id: args.id })
    },

   // Mock static data using the resolver map for a given type
    BookAuthor: {
      firstName: () => 'Sean',
      lastName: () => 'Johnson',
      fullName: () => 'Sean Johnson',
    }
  },

  middlewares: [

    // Use Falso for randomization / generation of rest of the schema
    falsoMiddleware({
      // Customize how often nulls appear for nullable fields
      nullPercentage: .5,
      nullListPercentage: .5,

      fields: {
        Book: {
          author: { nullPercentage: 0 }, // Force actor to always be present
          description: { falsoFn: 'randParagraph' },
          date: { falsoFn: 'randPastDate' },
        },

        // Since these fields are all statically defined in the resolver map
        // the falsoFns will not overwrite these values
        BookAuthor: {
          firstName: { falsoFn: 'randFirstName' },
          lastName: { falsoFn: 'randLastName' },
          fullName: { falsoFn: 'randFullName' },
        }
      }
    }),
    embed({
      wrappers: [spyWrapper],
    }),
  ],

  dependencies: {
    graphqlSchema,
  },
});

// Send the query
const query = handler.query(`
  {
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
`);

// console.log the result and the sinon spies that were applied to
// the resolver
query.then((result) => {
  console.log(JSON.stringify(result, null, 4));
});