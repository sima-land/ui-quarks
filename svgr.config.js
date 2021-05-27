module.exports = {
  plugins: [
    '@svgr/plugin-svgo',
    '@svgr/plugin-jsx',
  ],
  typescript: true,
  ref: true,
  svgoConfig: {
    plugins: [
      { removeAttrs: { attrs: 'fill' } },
      { removeViewBox: false },
      { cleanupIDs: false },
      { mergePaths: true },
    ],
  },
};
