import { useState } from 'react';

export function Component2() {
  const [count, setCount] = useState(10);

  const increase = () => {
    setCount((s) => s + 1);
  };

  const decrease = () => {
    setCount((s) => s - 1);
  };

  return (
    <div>
      <h2>앱 본문?</h2>
      <div>{count}</div>
      <button onClick={increase}>increase</button>
      <button onClick={decrease}>decrease</button>
    </div>
  );
}

if (module.hot) {
  module.hot.accept('../index');
}
