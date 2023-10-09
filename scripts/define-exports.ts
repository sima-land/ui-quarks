import glob from 'fast-glob';
import { defineIcon, defineOutput } from '../.build/utils';
import { outputFile } from 'fs-extra';

glob('src/**/*.svg')
  .then(paths => Promise.all(paths.map(item => defineIcon(item).then(defineOutput))))
  .then(items => {
    const exports: Record<string, unknown> = {};

    // ВАЖНО: используем сортировку чтобы результат не зависел от glob
    const sorted = [...items].sort((a, b) => (a.packagePath > b.packagePath ? 1 : -1));

    for (const item of sorted) {
      exports[`./${item.packagePath}`] = {
        types: `./${item.dtsOutputPath}`,
        require: `./${item.cjsOutputPath}`,
        import: `./${item.esmOutputPath}`,
        default: `./${item.esmOutputPath}`,
      };
    }

    return exports;
  })
  .then(exports => outputFile('./temp/exports.json', JSON.stringify(exports, null, 2)))
  .then(() => {
    console.log('[ui-quarks] exports sync done');
  });
