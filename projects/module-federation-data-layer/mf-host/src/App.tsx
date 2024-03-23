import { Suspense, lazy } from 'react';

import Remote2 from 'remote2/App';

function App() {
  const Remote1 = lazy(() => import('remote1/App'));

  return (
    <div>
      <h1>Host!!</h1>
      <div>
        <h2>Remote 1</h2>
        <Suspense fallback={<div>loading Remote 1</div>}>
          <Remote1 />
        </Suspense>
      </div>
      <div>
        <h2>Remote 2</h2>
        <Remote2 />
      </div>
    </div>
  );
}

export default App;
