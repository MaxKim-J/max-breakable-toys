import { useState } from 'react';

export function Component() {
  const [value, setValue] = useState('');

  return (
    <div>
      <h2>내부 패키지 의존성 컴포넌트입니다</h2>
      <input
        value={value}
        type="text"
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
    </div>
  );
}
