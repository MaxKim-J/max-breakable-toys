# handmade-dev-server-2

수제 React 데브 서버를 만들어본다 + 스코프 작게

- [x] React
- [ ] Watcher
- [ ] Web Socket
- [ ] Recompile(Dev Middleware)
- [ ] React Refresh

## 요구사항

- [x] 모든 코드는 TypeScript로 작성하고, esbuild로 서버 코드를 트랜스파일해 구동한다.
- [x] yarn dev하면 HTML과 webpack 빌드 결과물을 제공하는 dev server를 구동하고 서빙한다.
- [ ] webpack이 생산한 빌드 결과물은 메모리에만 있다.
- [ ] 기동시에 fs파일시스템을 이용한 정직한 리졸버를 통해 watch할 디렉토리를 빌드 과정에서 확보한다.
- [ ] Watch할 파일에 대한 정보를 서버 혹은 브라우저 로그로 보낸다.
- [ ] 해당 워처로 추적한 파일을 수정하면 Web Socket으로 브라우저에 리컴파일이 된다는 정보를 전달한다.
- [ ] 해당 워처로 추적한 파일을 수정하면 Webpack으로 리컴파일을 시킨다.
- [ ] 새로고침을 하면 새로운 번들로 바뀐다.
- [ ] 리컴파일 이후 브라우저에 리컴파일 되었음과 무슨 코드를 바꿔서 리컴파일이 되었는지 정보를 전달한다.
- [ ] react-refresh를 Webpack Custom Plugin으로 연동한다.
- [ ] 새로고침 없이 코드 수정시 화면에 업데이트를 달성한다.
- [ ] Watch하는 범위에 특정 설정 파일들을 추가한다
- [ ] CLI 인터페이스 설계

## 공부할 것

- [ ] 용어정리 - HMR, fast-refresh, live reload
- [ ] file descriptor와 성능이 가장 잘 나오는 방식
- [ ] Web Socket
- [ ] react-refresh의 동작 방식
