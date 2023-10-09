import path from 'node:path';
import glob from 'fast-glob';
import { readFile } from 'fs-extra';
import { isEqual } from 'lodash';
import { defineExports } from '../.build/utils';

lintPkg();

async function lintPkg() {
  await lintDistFilenames();
  await lintPackageJsonExports();

  console.log('[ui-quarks] dist lint done');
}

async function lintDistFilenames() {
  const paths = await glob('./dist/**/*.{js,svg}');

  if (paths.length === 0) {
    throw Error(`[ui-quarks] dist folder has no JS/SVG files`);
  }

  for (const item of paths) {
    if (!isNameInPascalCase(item)) {
      throw Error(`File name is not in PascalCase: ${item}`);
    }
  }
}

async function lintPackageJsonExports() {
  const { exports: fromPackageJson } = JSON.parse(await readFile('./package.json', 'utf-8'));

  const basedOnSrc = await glob('./src/**/*.svg').then(defineExports);

  if (!isEqual(fromPackageJson, basedOnSrc)) {
    throw Error(
      `[ui-quarks] "exports" field in "./package.json" not match actual files in "./src" folder`,
    );
  }
}

function isNameInPascalCase(pathname: string): boolean {
  const basename = path.basename(pathname, path.dirname(pathname));

  return basename[0] === basename[0].toUpperCase() && ![' ', '-', '_'].includes(basename);
}
