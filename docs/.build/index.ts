import path from 'node:path';
import { camelCase, upperFirst } from 'lodash';

interface IconInfo {
  identifier: string;
  importPath: string;
  packagePathname: string;
  packageFilename: string;
}

/**
 * Вернет данные иконки необходимые для формирования шаблонов.
 * @param jsRelativePath Путь до компонента иконки.
 * @return Данные.
 */
export function iconInfo(jsRelativePath: string): IconInfo {
  const distRel = path.relative('../dist', jsRelativePath);
  const distRelNoExt = distRel.split('.').slice(0, -1).join('.');

  return {
    // ВАЖНО: путь может начинаться с цифры - добавляем "_" в начало
    identifier: `_${upperFirst(camelCase(distRelNoExt))}`,
    importPath: `@sima-land/ui-quarks/${distRel}`,
    packagePathname: path.dirname(distRel),
    packageFilename: path.basename(distRel, path.extname(distRel)),
  };
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
