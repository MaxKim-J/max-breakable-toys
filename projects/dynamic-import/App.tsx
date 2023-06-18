import { Suspense, lazy, useState } from 'react';
import Dynamic from './Dynamic';

const DynamicComponent = lazy(() => import('./Dynamic'));

export default function App() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div>컴포넌트</div>
      {open ? (
        <Suspense fallback={<div>로딩</div>}>
          <DynamicComponent />
        </Suspense>
      ) : null}
      <div>
        <button
          onClick={() => {
            setOpen(true);
          }}
        >
          가져온다 다이나믹 임포트
        </button>
      </div>
    </div>
  );
}
