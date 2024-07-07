export default {
  layer: 'host',
  port: 3000,
  name: 'host',
  remotes: {
    remote1: 'remote1@http://localhost:3001/remoteEntry.js',
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
