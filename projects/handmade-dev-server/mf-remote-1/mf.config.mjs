export default {
  name: 'remote1',
  layer: 'remote',
  port: 3001,
  mfConfig: {
    name: 'remote1',
    filename: 'remoteEntry.js',
    exposes: {
      './App': './src/App.tsx',
    },
    shared: {
      react: {
        singleton: true,
        version: '18.2.0',
      },
      'react-dom': {
        singleton: true,
        version: '18.2.0',
      },
    },
  },
};
