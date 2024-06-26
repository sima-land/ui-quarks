import { outputFile } from 'fs-extra';
import { defineIcons, moduleTemplate } from '../.build/index.js';

defineIcons()
  .then(moduleTemplate)
  .then(source => outputFile('./generated/icons.ts', source, 'utf-8'))
  .then(() => console.log('[docs] prebuild done'));
