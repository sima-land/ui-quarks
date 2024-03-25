import path from 'node:path';
import rspack from '@rspack/core';

export default function config(env: unknown, argv: any): rspack.Configuration {
  return {
    entry: {
      main: './src/index.tsx',
    },
    output: {
      publicPath: argv.mode === 'production' ? '/ui-quarks/' : undefined,
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          loader: 'builtin:swc-loader',
          options: {
            sourceMap: true,
            jsc: {
              parser: {
                syntax: 'typescript',
                jsx: true,
              },
              transform: {
                react: {
                  runtime: 'automatic',
                },
              },
            },
          },
          type: 'javascript/auto',
        },
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
    plugins: [
      new rspack.HtmlRspackPlugin({
        template: './src/index.html',
      }),
    ],
  };
}
