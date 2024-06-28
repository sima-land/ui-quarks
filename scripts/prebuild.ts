import glob from 'fast-glob';
import { prebuildIcon, validateFilenames } from '../.build/utils.js';

glob('src/**/*.svg')
  .then(validateFilenames)
  .then(paths => Promise.all(paths.map(prebuildIcon)))
  .then(() => {
    console.log('[ui-quarks] prebuild done');
  });
