import { lazy, Suspense } from 'react';

const Remote1 = lazy(() => import('remote1/App'));
const Remote2 = lazy(() => import('remote2/App'));

function App() {
  return (
    <div>
      <h1>Host!!</h1>
      <div>
        <h2>Remote 1</h2>
        <Suspense fallback={<div>Remote 1 Loading</div>}>
          <Remote1 />
        </Suspense>
      </div>
      <div>
        <h2>Remote 2</h2>
        <Suspense fallback={<div>Remote 2 Loading</div>}>
          <Remote2 />
        </Suspense>
      </div>
    </div>
  );
}

export default App;
