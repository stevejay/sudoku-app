const CircularDependencyPlugin = require("circular-dependency-plugin");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
  //   basePath: "/sudoku-app",
  //   assetsPrefix: "/sudoku-app",
  webpack: (config) => {
    config.node = {
      fs: "empty",
    };
    config.plugins.push(
      new CircularDependencyPlugin({
        exclude: /node_modules/,
        failOnError: true,
        cwd: process.cwd(),
      })
    );
    return config;
  },
});
