const withPWA = require('next-pwa')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
module.exports = withPWA(withBundleAnalyzer({
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development'
  },
  webpack: (config) => {
    // Important: return the modified config
    return {
        ...config,
        mode: 'production',
        optimization: {
          ...config.optimization,
          splitChunks: {
            chunks: "all",
          },
        },
      }
  }
}),
);
