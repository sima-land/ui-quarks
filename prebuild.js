const fs = require('fs-extra');
const path = require('path');
const SVGO = require('svgo');
const svgr = require('@svgr/core').default;
const svgrConfig = require('./svgr.config');
const { upperFirst, camelCase, kebabCase } = require('lodash');
const { listAllFiles } = require('./build-utils');

async function main () {
  await preBuild(parseArgs());

  console.log('pre build: success!');
}

const parseArgs = () => {
  const arg = process.argv.slice(2).find(item => /^--tempDir=/.test(item));

  if (!arg) {
    throw Error('"--tempDir" argument must be provided');
  }

  return {
    tempDir: arg.replace(/^--tempDir=/, ''),
  };
};

async function preBuild ({ tempDir: tsxDir }) {
  const srcPath = path.join(process.cwd(), 'src/');
  const files = await listAllFiles(srcPath, { ext: '.svg' });
  const svgo = new SVGO({ plugins: svgrConfig.svgoConfig.plugins });

  for (const file of files) {
    const fileSource = await fs.readFile(file.path, 'utf8');

    const cleanName = path.basename(file.name, '.svg').replace('&', 'And');
    const fileNameBase = kebabCase(cleanName);
    const componentName = `${upperFirst(camelCase(cleanName))}SVG`;
    const basePath = file.dirname.replace(process.cwd() + '/src', '');

    const readySVG = (await svgo.optimize(fileSource, { path: file.path })).data;
    const readyTSX = await svgr(fileSource, svgrConfig, { componentName });

    const svgPath = path.join(process.cwd(), 'build', basePath, `${fileNameBase}.svg`);
    const tsxPath = path.join(process.cwd(), tsxDir, basePath, `${fileNameBase}.tsx`);

    await fs.outputFile(svgPath, readySVG);
    await fs.outputFile(tsxPath, readyTSX);
  }
}

main();
