import { ModuleLoader } from './DynamicRemoteLoader';

function App() {
  return (
    <div>
      <h1>Host!!</h1>
      <div>
        <h2>Remote 1</h2>
        {/* <ModuleLoader
          scope="remote1"
          module="./App"
          url="http://localhost:3001/remoteEntry.js"
        /> */}
      </div>
      <div>
        <h2>Remote 2</h2>
        {/* <ModuleLoader
          scope="remote2"
          module="./App"
          url="http://localhost:3002/remoteEntry.js"
        /> */}
      </div>
    </div>
  );
}

export default App;
