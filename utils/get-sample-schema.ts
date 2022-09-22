import fs from 'fs';
import path from 'path';

export function getSampleSchema() {
  return fs.readFileSync(
    path.join(__dirname, '../schemas/sample.graphql'),
    'utf-8'
  );
}
