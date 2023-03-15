import path from 'node:path';
import glob from 'fast-glob';
import { camelCase, upperFirst } from 'lodash';
import { outputFile } from 'fs-extra';

glob('../dist/**/*.js').then(paths => {
  const result = paths.map(item => {
    const distRel = path.relative('../dist', item);
    const distRelNoExt = distRel.split('.').slice(0, -1).join('.');

    return {
      importName: `_${upperFirst(camelCase(distRelNoExt))}`,
      importPath: `@sima-land/ui-quarks/${distRel}`,
      packagePathname: path.dirname(distRel),
      packageFilename: path.basename(distRel, path.extname(distRel)),
    };
  });

  const source = `
${result.map(item => `import ${item.importName} from '${item.importPath}';`).join('\n')}

export const icons = [
  ${result
    .map(
      item =>
        `
    {
      component: ${item.importName},
      componentName: '${`${item.packageFilename}SVG`}',
      importPath: '${item.importPath}',
      packagePathname: '${item.packagePathname}',
      packageFilename: '${item.packageFilename}',
    }`,
    )
    .join(',\n')}
];
`;

  outputFile('./generated/icons.ts', source, 'utf-8').then(() => {
    console.log('prebuild done');
  });
});
