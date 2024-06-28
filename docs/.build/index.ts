import path from 'node:path';
import lodash from 'lodash';
import fs from 'fs-extra';

const { camelCase, upperFirst } = lodash;

interface IconInfo {
  identifier: string;
  importPath: string;
  packagePathname: string;
  packageFilename: string;
}

export async function defineIcons() {
  const { exports } = JSON.parse(await fs.readFile('../package.json', 'utf-8'));

  const result: IconInfo[] = [];

  for (const pathname of Object.keys(exports)) {
    result.push({
      identifier: `_${upperFirst(camelCase(pathname))}`,
      importPath: path.join(`@sima-land/ui-quarks`, pathname),
      packagePathname: path.dirname(pathname).replace(/^\.\//, ''),
      packageFilename: path.basename(pathname).replace(/^\.\//, ''),
    });
  }

  return result;
}

/**
 * Шаблон модуля со всеми иконками.
 * @param icons Иконки.
 * @return Шаблон.
 */
export function moduleTemplate(icons: IconInfo[]) {
  return `
${icons.map(importTemplate).join('\n')}

export const icons = [
  ${icons.map(objectTemplate).join(',\n')}
];
`;
}

/**
 * Шаблон импорта иконки.
 * @param icon Иконка.
 * @return Шаблон.
 */
function importTemplate(icon: IconInfo) {
  return `import ${icon.identifier} from '${icon.importPath}';`;
}

/**
 * Шаблон объекта с данными иконки.
 * @param icon Иконка.
 * @return Шаблон.
 */
function objectTemplate(icon: IconInfo) {
  return `
{
  component: ${icon.identifier},
  componentName: '${`${icon.packageFilename}SVG`}',
  importPath: '${icon.importPath}',
  packagePathname: '${icon.packagePathname}',
  packageFilename: '${icon.packageFilename}',
}
`;
}
