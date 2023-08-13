export default {
  name: 'remote2',
  layer: 'remote',
  port: 3002,
  mfConfig: {
    name: 'remote2',
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
