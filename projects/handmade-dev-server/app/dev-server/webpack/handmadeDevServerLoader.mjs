import path from 'path';

const hmrModuleApiCode = (relPath) => {
  const hmrAcceptPath = relPath === undefined ? '' : `'${relPath}'`;

  return `
  if (module.hot) {
    module.hot.accept(${hmrAcceptPath});
  }
`;
};

const socketCode = () => `
if (window.hmrSocket === undefined) {
  window.hmrSocket = true;
  var socket = new WebSocket('ws://localhost:3000/dev-server');

  socket.onopen = function (event) {
    socket.send('[dev-server-client] handmade dev server 소켓이 연결되었습니다.');
  };
  
  socket.onmessage = function (event) {
    const message = JSON.parse(event.data);
  
    if (message.type === 'socketOpen') {
      console.log(message.text);
    }
  
    if (message.type === 'modifyDetected') {
      console.log(message.text);
    }
  
    if (message.type === 'compileSuccess') {
      console.log(message.text);
      if (module.hot && module.hot.status() === 'idle') {
        console.info('[dev-server-client] 컴파일 완료된 JS파일을 새로 로드하고, 엔트리에서부터 리렌더합니다.');
        module.hot
          .check(true)
          .then((outdatedModules) => {
            console.info('[dev-server-client] 다음 바뀐 파일들이 새롭게 평가됩니다.', outdatedModules);
          })
          .catch((e) => {
            console.info('[dev-server-client] 파일 업데이트 과정에서 에러가 발생했습니다.');
            console.error(e);
          });
      }
    }
  };
  
  socket.onclose = function (event) {
    console.log('[dev-server-client] 소켓 커넥션이 종료되었습니다.');
  };
  
  socket.onerror = function (error) {
    console.log('[dev-server-client] 소켓 통신 중 에러가 발생했습니다.' + error);
  };
}
`;

export default function (source) {
  const sourcePath = this.resourcePath;
  const { appEntry } = this.getOptions();

  let codeAppended = '';

  if (sourcePath === appEntry) {
    codeAppended = `${socketCode()}\n${hmrModuleApiCode()}`;
  } else {
    const relPath = path.relative(path.dirname(sourcePath), appEntry);
    codeAppended = `${hmrModuleApiCode(
      relPath.startsWith('.') ? relPath : `./${relPath}`
    )}`;
  }

  return `${source}\n${codeAppended}`;
}
