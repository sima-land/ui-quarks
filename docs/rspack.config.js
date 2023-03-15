const path = require('path');

module.exports = env => ({
  entry: {
    main: './src/index.tsx',
  },
  output: {
    publicPath: env.mode === 'production' ? '/ui-quarks/' : undefined,
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
        test: /\.module\.css$/i,
        type: 'css/module',
      },
      {
        test: /\.module\.scss$/,
        use: 'sass-loader',
        type: 'css/module',
      },
    ],
  },
});
