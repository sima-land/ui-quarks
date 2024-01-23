import path from 'node:path';
import { readFile, outputFile } from 'fs-extra';
import { transform } from '@svgr/core';
import { camelCase, upperFirst } from 'lodash';
import { optimize, Config as SVGOConfig } from 'svgo';
import { svgoConfig, svgoConfigColorful, svgrConfig } from './configs';

export interface IconDefined {
  svgSourcePath: string;
  baseName: string;
}

export interface OutputDefined extends IconDefined {
  packagePath: string;
  svgOutputPath: string;
  esmOutputPath: string;
  dtsOutputPath: string;
  tsxOutputPath: string;
}

export interface ExportItemDefined extends OutputDefined {
  export: {
    pathname: string;
    definition: string;
  };
}

export interface SVGRead extends OutputDefined {
  svgSourceRaw: string;
}

export interface SVGOptimized extends SVGRead {
  svgSourceOptimized: string;
  svgSourceOptimizedForInline: string;
}

export interface TSXGenerated extends SVGOptimized {
  tsxSource: string;
}

export async function prebuildIcon(svgPath: string) {
  return Promise.resolve(svgPath)
    .then(defineIcon)
    .then(defineOutput)
    .then(readSVG)
    .then(optimizeSVG)
    .then(generateTSX)
    .then(outputSvgAndTsx);
}

export async function defineIcon(svgPath: string): Promise<IconDefined> {
  const filename = path.basename(svgPath, path.extname(svgPath)).trim();
  const baseName = upperFirst(camelCase(filename.replace(/\+/g, 'Plus').replace(/\&/g, 'And')));

  // @todo валидация имени

  return {
    svgSourcePath: svgPath,
    baseName,
  };
}

export async function defineOutput(ctx: IconDefined): Promise<OutputDefined> {
  const packageDir = path.dirname(path.relative('./src', ctx.svgSourcePath));

  const svgDir = path.join('./dist', packageDir);
  const esmDir = path.join('./dist', packageDir);
  const dtsDir = path.join('./dist/types', packageDir);
  const tsxDir = path.join('./temp', packageDir);

  return {
    ...ctx,
    packagePath: path.join(packageDir, ctx.baseName),
    svgOutputPath: path.join(svgDir, `${ctx.baseName}.svg`),
    esmOutputPath: path.join(esmDir, `${ctx.baseName}.js`),
    dtsOutputPath: path.join(dtsDir, `${ctx.baseName}.d.ts`),
    tsxOutputPath: path.join(tsxDir, `${ctx.baseName}.tsx`),
  };
}

export function defineExportsItem(ctx: OutputDefined): ExportItemDefined {
  return {
    ...ctx,
    export: {
      pathname: `./${ctx.packagePath}`,
      definition: `./${ctx.esmOutputPath}`,
    },
  };
}

async function readSVG(ctx: OutputDefined): Promise<SVGRead> {
  return {
    ...ctx,
    svgSourceRaw: await readFile(ctx.svgSourcePath, 'utf-8'),
  };
}

async function optimizeSVG(ctx: SVGRead): Promise<SVGOptimized> {
  const colorful = ctx.svgSourcePath.split(path.sep).includes('Colorful');

  const config: SVGOConfig = colorful ? svgoConfigColorful : svgoConfig;

  const configForInline: SVGOConfig = {
    ...config,
    plugins: [...(config.plugins ?? []), { name: 'removeXMLNS' }],
  };

  return {
    ...ctx,
    svgSourceOptimized: optimize(ctx.svgSourceRaw, config).data,
    svgSourceOptimizedForInline: optimize(ctx.svgSourceRaw, configForInline).data,
  };
}

async function generateTSX(ctx: SVGOptimized): Promise<TSXGenerated> {
  return {
    ...ctx,
    tsxSource: await transform(ctx.svgSourceOptimizedForInline, svgrConfig, {
      componentName: `${ctx.baseName}SVG`,
    }),
  };
}

async function outputSvgAndTsx(ctx: TSXGenerated): Promise<TSXGenerated> {
  await Promise.all([
    outputFile(ctx.svgOutputPath, ctx.svgSourceOptimized),
    outputFile(ctx.tsxOutputPath, ctx.tsxSource),
  ]);

  return { ...ctx };
}

export async function defineExports(iconPaths: string[]) {
  const items = await Promise.all(iconPaths.map(item => defineIcon(item).then(defineOutput)));

  const sortedExportItems = [...items]
    .sort((a, b) => (a.packagePath > b.packagePath ? 1 : -1)) // ВАЖНО: используем сортировку для стабильности
    .map(defineExportsItem);

  const result: Record<string, unknown> = {};

  for (const item of sortedExportItems) {
    const { pathname, definition } = item.export;
    result[pathname] = definition;
  }

  return result;
}
