import path from 'node:path';
import type { Configuration } from '@rspack/cli';

export default function config(env: unknown, argv: any): Configuration {
  return {
    entry: {
      main: './src/index.tsx',
    },
    output: {
      publicPath: argv.mode === 'production' ? '/ui-quarks/' : undefined,
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist'),
    },
    builtins: {
      html: [
        {
          template: './src/index.html',
        },
      ],
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          type: 'css',
        },
        {
          test: /\.(module|m)\.css$/i,
          type: 'css/module',
        },
        {
          test: /\.(module|m)\.scss$/,
          use: 'sass-loader',
          type: 'css/module',
        },
      ],
    },
  };
}
