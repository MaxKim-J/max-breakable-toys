import { Suspense, lazy } from 'react';

function App() {
  const Remote2 = lazy(() => import('remote2/App'));

  return (
    <div>
      <p>Remote 1 App Loaded</p>
      <div>
        <h2>Remote 2</h2>
        <Suspense fallback={<div>loading Remote 2</div>}>
          <Remote2 />
        </Suspense>
      </div>
    </div>
  );
}

export default App;
