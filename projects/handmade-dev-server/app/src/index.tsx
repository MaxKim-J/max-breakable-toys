import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootNode = document.getElementById('root') as HTMLElement;

ReactDOM.createRoot(rootNode).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if (module.hot) {
  module.hot.accept();
}

// 엔트리가 되는 모든 코드에 이 코드를 넣어줘야함
// 메인 엔트리에서 hot.update 스크립트를 로드해야함
// 한번만 평가되어야함

if (window?.hmrSocket === undefined) {
  // Connect to WebSocket
  var socket = new WebSocket('ws://localhost:3000/dev-server');

  socket.onopen = function (event) {
    socket.send('Hello Server!');
  };

  socket.onmessage = function (event) {
    const message = JSON.parse(event.data);

    if (message.type === 'notice') {
      console.log(message.text);
    }

    if (message.type === 'modify') {
      console.log(message.text);

      if (message.text === '[dev-server] 웹팩 리컴파일을 완료했습니다.') {
        if (module.hot && module.hot.status() === 'idle') {
          console.info('hot check');
          module.hot
            .check(true)
            .then((outdatedModules) => {
              console.log('Updated modules:', outdatedModules);
            })
            .catch((e) => console.info(e));
        }
      }
    }
  };

  socket.onclose = function (event) {
    console.log('Server: Connection Closed');
  };

  socket.onerror = function (error) {
    console.log('WebSocket Error: ' + error);
  };

  window.hmrSocket = true;
}
