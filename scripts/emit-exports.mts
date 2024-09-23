import glob from 'fast-glob';
import { outputFile } from 'fs-extra';
import { defineExports } from '../.build/utils.mjs';

glob('src/**/*.svg')
  .then(defineExports)
  .then(exports => JSON.stringify(exports, null, 2))
  .then(content => outputFile('./temp/exports.json', content))
  .then(() => {
    console.log('[ui-quarks] exports emit done');
  });
