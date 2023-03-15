import path from 'node:path';
import { readFile, outputFile } from 'fs-extra';
import { transform } from '@svgr/core';
import { camelCase, upperFirst } from 'lodash';
import { optimize } from 'svgo';
import { svgoConfig, svgrConfig } from './configs';

interface Start {
  svgRelativePath: string;
  componentName: string;
}

interface SVGRead extends Start {
  svgRaw: string;
}

interface SVGOptimized extends SVGRead {
  svgOptimized: string;
}

interface TSXGenerated extends SVGOptimized {
  tsx: string;
}

export async function prebuildIcon(svgRelativePath: string) {
  return start(svgRelativePath)
    .then(readSVG)
    .then(optimizeSVG)
    .then(generateTSX)
    .then(parallel(outputSVG, outputTSX));
}

async function start(svgRelativePath: string): Promise<Start> {
  const filename = path.basename(svgRelativePath, path.extname(svgRelativePath)).trim();
  const componentName = upperFirst(camelCase(filename.replace(/&/, 'And')));

  return {
    componentName,
    svgRelativePath,
  };
}

async function readSVG(ctx: Start): Promise<SVGRead> {
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
    tsx: await transform(ctx.svgOptimized, svgrConfig),
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
