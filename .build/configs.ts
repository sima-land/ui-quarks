import type { Config as SVGRConfig } from '@svgr/core';
import type { Config as SVGOConfig } from 'svgo';

export const svgoConfig: SVGOConfig = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          cleanupIds: false,
          removeViewBox: false,
          collapseGroups: false,
        },
      },
    },
    { name: 'removeAttrs', params: { attrs: 'fill' } },
    { name: 'mergePaths' },
    { name: 'prefixIds' },
  ],
};

export const svgoConfigColorful: SVGOConfig = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          cleanupIds: false,
          removeViewBox: false,
          collapseGroups: false,
        },
      },
    },
    { name: 'mergePaths' },
    { name: 'prefixIds' },
  ],
};

export const svgrConfig: SVGRConfig = {
  plugins: ['@svgr/plugin-jsx', '@svgr/plugin-prettier'],
  ref: true,
  jsxRuntime: 'automatic',
  typescript: true,
  prettier: true,
};
