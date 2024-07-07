export default {
  layer: 'remote',
  port: 3001,
  name: 'remote1',
  remotes: {
    remote2: 'remote2@http://localhost:3002/remoteEntry.js',
  },
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
};
