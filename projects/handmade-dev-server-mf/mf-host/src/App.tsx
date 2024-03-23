import { Suspense, lazy } from 'react';
import { getId, getMessage } from 'dev-server-mf-shared-package';
import { plus } from './plus';

function App() {
  // @ts-ignore
  const Remote1 = lazy(() => import('remote1/App'));
  // @ts-ignore
  const Remote2 = lazy(() => import('remote2/App'));

  plus(2, 1);

  return (
    <div>
      <h1>Host!!</h1>
      <p>random ID: {getId()}</p>
      <p>Message: {getMessage()}</p>
      <div>
        <h2>Remote 1</h2>
        <Suspense fallback={<div>loading Remote 1</div>}>
          <Remote1 />
        </Suspense>
      </div>
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
