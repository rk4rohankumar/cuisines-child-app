const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.output.publicPath = 'http://localhost:3004/';

      webpackConfig.plugins.push(
        new ModuleFederationPlugin({
          name: 'CuisinesApp',
          filename: 'remoteEntry.js',
          exposes: {
            './CuisinesApp': './src/App',
          },
          shared: {
            react: { eager: true },
            'react-dom': { eager: true },
            'tailwindcss': { eager: true }
          },
        })
      );
      return webpackConfig;
    },
  },
};
