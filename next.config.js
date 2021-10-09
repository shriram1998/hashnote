const withPWA = require('next-pwa')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
module.exports = withPWA(withBundleAnalyzer({
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development'
  },
  distDir: 'build',
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
          ...config.optimization,
          splitChunks: {
            chunks: "all",
          },
        },
      }
    } else {
      return config;
    }
  }
}),
);
