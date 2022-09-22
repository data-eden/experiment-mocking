import { MockingLibraryExperiment } from './library';
import { getSampleSchema } from '../../utils/get-sample-schema';

const queryStr = `query Book {
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
  }`;

(async function () {
  const lib = new MockingLibraryExperiment({
    schema: getSampleSchema(),
  });

  const defaultMock = lib.mockGraphQLQuery(queryStr);
  console.log(JSON.stringify(await defaultMock.getPayload(), null, 2));

  const mockWithProvidedData = lib.mockGraphQLQuery(queryStr, {
    description: 'test value',
    author: {
      firstName: 'provided first name',
    },
  });

  console.log(JSON.stringify(await mockWithProvidedData.getPayload(), null, 2));

  const invalidMock = lib.mockGraphQLQuery(queryStr, {
    author: {
      unknownField: 'unknown field',
    },
  });

  console.log(JSON.stringify(await invalidMock.getPayload(), null, 2));
})();
