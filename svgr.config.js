module.exports = {
  plugins: [
    '@svgr/plugin-svgo',
    '@svgr/plugin-jsx',
  ],
  typescript: true,
  svgoConfig: {
    plugins: [
      { removeViewBox: false },
      { cleanupIDs: false },
      { mergePaths: true },
    ],
  },
};
