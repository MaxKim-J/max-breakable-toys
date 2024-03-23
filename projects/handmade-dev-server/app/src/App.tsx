import { useState } from 'react';
import { Component } from '@breakable-toys/dev-server-package';
import { Component2 } from './Component/Component2';

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
      <h1>You`re dev server must be handmaded!</h1>
      <div>
        <Component />
        <Component2 />
      </div>
    </main>
  );
}

export default App;
