const fs = require('fs-extra');
const path = require('path');
const { default: svgr } = require('@svgr/core');
const svgrConfig = require('./svgr.config');
const { upperFirst, camelCase, kebabCase } = require('lodash');
const { listAllFiles } = require('./build-utils');

async function main () {
  await preBuild(resolveArgs().tempDir);

  console.log('pre build: success!');
}

const resolveArgs = () => {
  const arg = process.argv.slice(2).find(item => /^--tempDir=/.test(item));

  if (!arg) {
    throw Error('"--tempDir" argument must be provided');
  }

  return {
    tempDir: arg.replace(/^--tempDir=/, ''),
  };
};

async function preBuild (tempDirPath) {
  const srcPath = path.join(__dirname, 'src/');
  const tempPath = path.join(__dirname, `${tempDirPath}/`);
  const buildPath = path.join(__dirname, 'build/');

  await copySVG(srcPath, buildPath);
  await createTSX(srcPath, tempPath);
}

async function copySVG (srcPath, targetPath) {
  await fs.copy(srcPath, targetPath);

  const files = (await listAllFiles(targetPath)).filter(file => path.extname(file.name) === '.svg');

  for (const file of files) {
    const cleanName = path.basename(file.name, '.svg').replace('&', 'And');
    const fileNameBase = kebabCase(cleanName);

    // переименовываем в kebab-case
    await fs.rename(file.path, path.join(file.dirname, `${fileNameBase}.svg`));
  }
}

async function createTSX (srcPath, targetPath) {
  // копируем все файлы из src во временный каталог
  await fs.copy(srcPath, targetPath);

  const tempFiles = (await listAllFiles(targetPath)).filter(file => path.extname(file.name) === '.svg');

  // меняем каждый временный файл svg на временный файл tsx
  for (const file of tempFiles) {
    const cleanName = path.basename(file.name, '.svg').replace('&', 'And');

    const fileNameBase = kebabCase(cleanName);
    const componentName = upperFirst(camelCase(cleanName));

    const svgCode = await fs.readFile(file.path, 'utf8');
    const componentCode = await svgr(svgCode, svgrConfig, { componentName });

    // меняем исходный код SVG на исходный код React-компонента
    await fs.writeFile(file.path, componentCode);

    // переименовываем файл в .tsx, исправляем имя на kebab-case
    await fs.rename(file.path, path.join(file.dirname, `${fileNameBase}.tsx`));
  }
}

main();
