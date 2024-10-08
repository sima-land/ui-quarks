import glob from 'fast-glob';
import { prebuildIcon, validateFilenames } from '../.build/utils.mjs';

glob('src/**/*.svg')
  .then(validateFilenames)
  .then(paths => Promise.all(paths.map(prebuildIcon)))
  .then(() => {
    console.log('[ui-quarks] prebuild done');
  });
