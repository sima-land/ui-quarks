import glob from 'fast-glob';
import { prebuildIcon } from './.build';

glob('src/**/*.svg')
  .then(paths => Promise.all(paths.map(prebuildIcon)))
  .then(() => console.log('[ui-quarks] prebuild done'));
