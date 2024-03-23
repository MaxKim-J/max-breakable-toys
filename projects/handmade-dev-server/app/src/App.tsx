import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  const increase = () => {
    setCount((s) => s + 1);
  };

  const decrease = () => {
    setCount((s) => s - 1);
  };

  return (
    <main>
      <h1>Count</h1>
      <div>
        <div>{count}</div>
        <button onClick={increase}>increase</button>
        <button onClick={decrease}>decrease</button>
      </div>
    </main>
  );
}

export default App;
