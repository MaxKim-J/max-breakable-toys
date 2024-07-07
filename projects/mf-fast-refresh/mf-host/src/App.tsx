import { MicroAppLoader } from '@breakable-toy/mf-fast-refresh-framework/loader';

function App() {
  return (
    <div style={{ border: '2px solid red' }}>
      <h1 style={{ color: 'red', padding: '10px' }}>빨간색은 Host!!</h1>
      <div>
        <MicroAppLoader
          scope="remote1"
          module="./App"
          url="http://localhost:3001/remoteEntry.js"
        />
      </div>
    </div>
  );
}

export default App;
