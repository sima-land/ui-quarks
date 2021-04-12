/* eslint-disable require-jsdoc, jsdoc/require-jsdoc */
const fs = require('fs-extra');
const path = require('path');
const { customAlphabet } = require('nanoid');
const englishLowercase = require('nanoid-dictionary/lowercase');
const { listAllFiles } = require('../build-utils');
const { camelCase, upperFirst } = require('lodash');

const randomString = customAlphabet(englishLowercase, 10);

const baseName = value => path.basename(value).replace(path.extname(value), '');

async function main () {
  const files = await listAllFiles(path.join(process.cwd(), 'build/'), { ext: '.js' });
  const parts = [];

  for (const file of files) {
    const relativePath = file.path.replace(`${process.cwd()}/build/`, '');
    const exportName = `${upperFirst(camelCase(baseName(relativePath)))}SVG`;

    parts.push({
      importName: randomString(),
      importPath: relativePath,
      exportName,
    });
  }

  const imports = parts
    .map(part => `import ${part.importName} from "../build/${part.importPath}";`)
    .join('\n');

  const constants = parts
    // eslint-disable-next-line max-len
    .map(p => `const ${p.importName}Data = { icon: ${p.importName}, name: "${p.exportName}", path: "${p.importPath}" };`)
    .join('\n');

  const exports = `export { ${parts.map(part => `${part.importName}Data`).join(',\n')} };`;

  await fs.outputFile(path.join(process.cwd(), 'docs-temp/icons.js'), [
    imports,
    constants,
    exports,
  ].join('\n\n'));
}

main();
