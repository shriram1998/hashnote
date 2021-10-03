const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
module.exports = withBundleAnalyzer({
  webpack: (config, options) => {
    // Important: return the modified config
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });
    if (!options.dev) {
      return {
        ...config,
        optimization: {
          splitChunks: {
            chunks: "all",
          },
        },
      }
    } else {
      return config;
    }
  }
});
