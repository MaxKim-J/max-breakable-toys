import { Suspense, lazy } from 'react';

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
    </div>
  );
}

export default App;
