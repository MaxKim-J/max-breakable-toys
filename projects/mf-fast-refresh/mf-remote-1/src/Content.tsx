import { MicroAppLoader } from '@breakable-toy/mf-fast-refresh-framework/loader';

export function Content() {
  return (
    <div style={{ border: '2px solid blue', margin: '10px' }}>
      <h1 style={{ color: 'blue', padding: '10px' }}>파란색은 remote1</h1>
      <MicroAppLoader
        scope="remote2"
        module="./App"
        url="http://localhost:3002/remoteEntry.js"
      />
    </div>
  );
}
