import path from 'node:path';
import rspack from '@rspack/core';

export default function config(env: unknown, argv: any): rspack.Configuration {
  const isProduction = argv.mode === 'production';

  return {
    entry: {
      main: './src/index.tsx',
    },
    output: {
      publicPath: isProduction ? '/ui-quarks/' : undefined,
      filename: 'main.js',
      path: path.resolve(import.meta.dirname, 'dist'),
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
          test: /\.(css|scss)$/i,
          use: [
            rspack.CssExtractRspackPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: {
                  auto: /\.(module|m)\.(css|scss)$/i,
                  localIdentName: isProduction ? '[hash:7]' : '[name]__[local]__[hash:3]',
                  exportLocalsConvention: 'as-is',
                  namedExport: false,
                },
              },
            },
            {
              loader: 'sass-loader',
            },
          ],
        },
      ],
    },
    plugins: [
      new rspack.CssExtractRspackPlugin({
        filename: isProduction ? '[name].[contenthash:5].css' : '[name].css',
      }),
      new rspack.HtmlRspackPlugin({
        template: './src/index.html',
        scriptLoading: 'module',
      }),
    ],
    experiments: {
      outputModule: true,
      css: false,
    },
  };
}
