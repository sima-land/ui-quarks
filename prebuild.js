const fs = require('fs-extra');
const path = require('path');
const { default: svgr } = require('@svgr/core');
const svgrConfig = require('./svgr.config');
const { upperFirst, camelCase, kebabCase } = require('lodash');

async function main () {
  await preBuild(resolveTempDir());

  console.log('pre build: success!');
}

const resolveTempDir = () => {
  const arg = process.argv.slice(2).find(item => /^--tempDir=/.test(item));

  if (!arg) {
    throw Error('"--tempDir" argument must be provided');
  }

  return arg.replace(/^--tempDir=/, '');
};

async function preBuild (tempDirPath) {
  const srcPath = path.join(__dirname, 'src/');
  const tempPath = path.join(__dirname, `${tempDirPath}/`);

  // копируем все файлы из src во временный каталог
  await fs.copy(srcPath, tempPath);

  const allTempIconFiles = (await getAllFiles(tempPath)).filter(file => /\.svg$/.test(file.name));

  // меняем каждый временный файл svg на временный файл tsx
  for (const file of allTempIconFiles) {
    const cleanName = file.name
      .replace(/\.svg$/, '')
      .replace('&', 'And');

    const svgCode = await fs.readFile(file.path, 'utf8');

    const componentCode = await svgr(svgCode, svgrConfig, {
      componentName: upperFirst(camelCase(cleanName)),
    });

    // меняем исходный код SVG на исходный код React-компонента
    await fs.writeFile(file.path, componentCode);

    // переименовываем файл в .tsx, исправляем имя на kebab-case
    await fs.rename(file.path, path.join(file.pathWithoutName, `${kebabCase(cleanName)}.tsx`));
  }
}

async function getAllFiles (rootPath) {
  const entries = await fs.readdir(rootPath, { withFileTypes: true });

  const files = entries
    .filter(entry => !entry.isDirectory())
    .map(file => ({
      ...file,
      path: path.join(rootPath, file.name),
      pathWithoutName: rootPath,
    }));

  const folders = entries.filter(entry => entry.isDirectory());

  for (const folder of folders) {
    files.push(...await getAllFiles(`${rootPath}${folder.name}/`));
  }

  return files;
}

main();
