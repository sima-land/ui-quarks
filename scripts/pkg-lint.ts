import glob from 'fast-glob';
import path from 'node:path';

function isNameInPascalCase(pathname: string): boolean {
  const basename = path.basename(pathname, path.dirname(pathname));

  return basename[0] === basename[0].toUpperCase() && ![' ', '-', '_'].includes(basename);
}

glob('./dist/**/*.{js,svg}')
  .then(paths => {
    if (paths.length === 0) {
      throw Error(`[ui-quarks] dist folder has no JS/SVG files`);
    }

    for (const item of paths) {
      if (!isNameInPascalCase(item)) {
        throw Error(`File name is not in PascalCase: ${item}`);
      }
    }
  })
  .then(() => {
    console.log('[ui-quarks] dist lint done');
  });
