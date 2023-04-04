import path from 'node:path';
import { readFile, outputFile } from 'fs-extra';
import { transform } from '@svgr/core';
import { camelCase, upperFirst } from 'lodash';
import { optimize } from 'svgo';
import { svgoConfig, svgrConfig } from './configs';

interface IconDefined {
  svgPath: string;
  baseName: string;
}

interface SVGRead extends IconDefined {
  svgSourceRaw: string;
}

interface SVGOptimized extends SVGRead {
  svgSourceOptimized: string;
}

interface TSXGenerated extends SVGOptimized {
  tsxSource: string;
}

export async function prebuildIcon(svgPath: string) {
  return Promise.resolve(svgPath)
    .then(defineIcon)
    .then(readSVG)
    .then(optimizeSVG)
    .then(generateTSX)
    .then(parallel(outputSVG, outputTSX));
}

async function defineIcon(svgPath: string): Promise<IconDefined> {
  const filename = path.basename(svgPath, path.extname(svgPath)).trim();
  const baseName = upperFirst(camelCase(filename.replace(/&/g, 'And')));

  return {
    svgPath,
    baseName,
  };
}

async function readSVG(ctx: IconDefined): Promise<SVGRead> {
  return {
    ...ctx,
    svgSourceRaw: await readFile(ctx.svgPath, 'utf-8'),
  };
}

async function optimizeSVG(ctx: SVGRead): Promise<SVGOptimized> {
  return {
    ...ctx,
    svgSourceOptimized: optimize(ctx.svgSourceRaw, svgoConfig).data,
  };
}

async function generateTSX(ctx: SVGOptimized): Promise<TSXGenerated> {
  return {
    ...ctx,
    tsxSource: await transform(ctx.svgSourceOptimized, svgrConfig, {
      componentName: `${ctx.baseName}SVG`,
    }),
  };
}

async function outputSVG(ctx: TSXGenerated) {
  const dist = path.join('./dist', path.dirname(path.relative('./src', ctx.svgPath)));
  await outputFile(path.join(dist, `${ctx.baseName}.svg`), ctx.svgSourceOptimized);
}

async function outputTSX(ctx: TSXGenerated) {
  const temp = path.join('./temp', path.dirname(path.relative('./src', ctx.svgPath)));
  await outputFile(path.join(temp, `${ctx.baseName}.tsx`), ctx.tsxSource);
}

function parallel<T extends any[]>(...fns: Array<(...args: T) => void>): (...args: T) => void {
  return (...args: T) => Promise.all(fns.map(fn => fn(...args)));
}
