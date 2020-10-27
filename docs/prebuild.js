const fs = require('fs-extra');
const path = require('path');
const babelParser = require('@babel/parser');
const { customAlphabet } = require('nanoid');
const englishLowercase = require('nanoid-dictionary/lowercase');
const { listAllFiles } = require('../build-utils');

const randomString = customAlphabet(englishLowercase, 10);

function getDefaultExportName (source) {
  const { program } = babelParser.parse(source, { sourceType: 'module' });

  return program.body.find(({ type }) => type === 'ExportDefaultDeclaration').declaration.name;
}

async function main () {
  const files = await listAllFiles(path.join(process.cwd(), 'build/'), { ext: '.js' });

  const parts = [];

  for (const file of files) {
    const relativePath = file.path.replace(process.cwd() + '/build/', '');
    const originalExportName = getDefaultExportName(await fs.readFile(file.path, 'utf-8'));

    parts.push({
      importName: randomString(),
      importPath: relativePath,
      originalExportName,
    });
  }

  const imports = parts
    .map(part => `import ${part.importName} from "../build/${part.importPath}";`)
    .join('\n');

  const constants = parts
    .map(part => {
      return `const ${part.importName + 'Data'} = { icon: ${part.importName}, name: "${part.originalExportName}", path: "${part.importPath}" };`;
    })
    .join('\n');

  const exports = `export { ${parts.map(part => part.importName + 'Data').join(',\n')} };`;

  await fs.outputFile(path.join(process.cwd(), 'docs-temp/icons.js'), [
    imports,
    constants,
    exports,
  ].join('\n\n'));
}

main();
