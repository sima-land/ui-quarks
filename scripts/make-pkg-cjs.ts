import { readFile, outputFile } from 'fs-extra';

readFile('./package.json', 'utf-8')
  .then(JSON.parse)
  .then(({ name, version }) => ({ name, version, type: 'commonjs' }))
  .then(data => outputFile('dist/cjs/package.json', JSON.stringify(data)))
  .then(() => console.log('[ui-quarks] CJS pkg emit done'));
