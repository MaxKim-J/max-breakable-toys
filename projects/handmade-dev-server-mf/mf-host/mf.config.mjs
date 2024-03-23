export default {
  name: 'host',
  layer: 'host',
  port: 3000,
  mfConfig: {
    name: 'host',
    remotes: {
      remote1: 'remote1@http://localhost:3001/remoteEntry.js',
      remote2: 'remote2@http://localhost:3002/remoteEntry.js',
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
