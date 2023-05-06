import { lazy, Suspense } from 'react';

import { getVersion, getId } from 'shared-deps-mf-package';

const Remote1 = lazy(() => import('remote1/App'));
const Remote2 = lazy(() => import('remote2/App'));

function App() {
  return (
    <div>
      <h1>Host!!</h1>
      <p>Host의 공유 패키지 버전 {getVersion()}</p>
      <p>Host의 공유 패키지 Id {getId()}</p>
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
