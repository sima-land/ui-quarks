import { readFile, outputFile } from 'fs-extra';

readFile('./package.json', 'utf-8')
  .then(JSON.parse)
  .then(({ name, version }) => ({ name, version, type: 'module' }))
  .then(data => outputFile('dist/esm/package.json', JSON.stringify(data)))
  .then(() => console.log('[ui-quarks] ESM pkg emit done'));
