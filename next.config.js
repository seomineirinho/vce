/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ["images.unsplash.com"],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ensure splitChunks exists
      if (!config.optimization.splitChunks) {
        config.optimization.splitChunks = {};
      }

      // Ensure cacheGroups exists
      if (!config.optimization.splitChunks.cacheGroups) {
        config.optimization.splitChunks.cacheGroups = {};
      }

      // Ensure default cacheGroup exists
      if (!config.optimization.splitChunks.cacheGroups.default) {
        config.optimization.splitChunks.cacheGroups.default = {};
      }

      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          default: {
            ...config.optimization.splitChunks.cacheGroups.default,
            enforce: true,
          },
        },
      };
    }
    return config;
  },
};

if (process.env.NEXT_PUBLIC_TEMPO) {
  nextConfig["experimental"] = {
    // NextJS 13.4.8 up to 14.1.3:
    // swcPlugins: [[require.resolve("tempo-devtools/swc/0.86"), {}]],
    // NextJS 14.1.3 to 14.2.11:
    swcPlugins: [[require.resolve("tempo-devtools/swc/0.90"), {}]],

    // NextJS 15+ (Not yet supported, coming soon)
  };
}

module.exports = nextConfig;
