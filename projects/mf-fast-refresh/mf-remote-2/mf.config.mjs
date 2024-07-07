export default {
  layer: 'remote',
  port: 3002,
  name: 'remote2',
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
