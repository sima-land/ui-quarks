import path from 'node:path';
import { readFile, outputFile } from 'fs-extra';
import { transform } from '@svgr/core';
import { camelCase, upperFirst } from 'lodash';
import { optimize } from 'svgo';
import { svgoConfig, svgrConfig } from './configs';

interface ComponentNamed {
  svgRelativePath: string;
  componentName: string;
}

interface SVGRead extends ComponentNamed {
  svgRaw: string;
}

interface SVGOptimized extends SVGRead {
  svgOptimized: string;
}

interface TSXGenerated extends SVGOptimized {
  tsx: string;
}

export async function prebuildIcon(svgRelativePath: string) {
  return Promise.resolve(svgRelativePath)
    .then(defineName)
    .then(readSVG)
    .then(optimizeSVG)
    .then(generateTSX)
    .then(parallel(outputSVG, outputTSX));
}

async function defineName(svgRelativePath: string): Promise<ComponentNamed> {
  const filename = path.basename(svgRelativePath, path.extname(svgRelativePath)).trim();
  const componentName = upperFirst(camelCase(filename.replace(/&/g, 'And')));

  return {
    componentName,
    svgRelativePath,
  };
}

async function readSVG(ctx: ComponentNamed): Promise<SVGRead> {
  return {
    ...ctx,
    svgRaw: await readFile(ctx.svgRelativePath, 'utf-8'),
  };
}

async function optimizeSVG(ctx: SVGRead): Promise<SVGOptimized> {
  return {
    ...ctx,
    svgOptimized: optimize(ctx.svgRaw, svgoConfig).data,
  };
}

async function generateTSX(ctx: SVGOptimized): Promise<TSXGenerated> {
  return {
    ...ctx,
    tsx: await transform(ctx.svgOptimized, svgrConfig, {
      componentName: `${ctx.componentName}SVG`,
    }),
  };
}

async function outputSVG(ctx: TSXGenerated) {
  const dist = path.join('./dist', path.dirname(path.relative('./src', ctx.svgRelativePath)));
  await outputFile(path.join(dist, `${ctx.componentName}.svg`), ctx.svgOptimized);
}

async function outputTSX(ctx: TSXGenerated) {
  const temp = path.join('./temp', path.dirname(path.relative('./src', ctx.svgRelativePath)));
  await outputFile(path.join(temp, `${ctx.componentName}.tsx`), ctx.tsx);
}

function parallel<T extends any[]>(...fns: Array<(...args: T) => void>): (...args: T) => void {
  return (...args: T) => Promise.all(fns.map(fn => fn(...args)));
}
