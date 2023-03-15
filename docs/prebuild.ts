import glob from 'fast-glob';
import { outputFile } from 'fs-extra';
import { iconInfo, moduleTemplate } from './.build';

glob('../dist/**/*.js')
  .then(paths => paths.map(iconInfo))
  .then(moduleTemplate)
  .then(source => outputFile('./generated/icons.ts', source, 'utf-8'))
  .then(() => console.log('[docs] prebuild done'));
