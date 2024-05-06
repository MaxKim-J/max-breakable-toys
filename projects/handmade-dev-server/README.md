# handmade-dev-server-2

수제 React 데브 서버를 만들어본다 + 스코프 작게

## 요구사항

### 개발 바닥깔기

- [x] 모든 코드는 TypeScript로 작성하고, esbuild로 서버 코드를 트랜스파일해 구동한다.
- [x] nodemon을 달아서 매번 서버를 끄고키지 않아도 되게 만든다.

### dev-server + socket

- [x] yarn dev하면 HTML과 webpack 빌드 결과물을 제공하는 dev server를 구동하고 서빙한다.
- [x] Watch할 파일에 대한 정보를 서버 로그로 표시한다.
- [x] 기동시에 fs파일시스템을 이용한 정직한 리졸버를 통해 watch할 디렉토리를 빌드 과정에서 확보한다.
- [x] 해당 워처로 추적한 파일을 수정하면 Web Socket으로 브라우저에 리컴파일이 된다는 정보를 전달한다.
- [x] 해당 워처로 추적한 파일을 수정하면 Webpack으로 리컴파일을 시킨다.
- [x] 리컴파일 이후 브라우저에 리컴파일 되었음과 무슨 코드를 바꿔서 리컴파일이 되었는지 정보를 전달한다.

### live reload

파일이 변경될 때 전체 어플리케이션을 다시 로드합니다. 이러한 방식은 코드 변경 후 전체 페이지를 새로 로드해야 하는 경우 유용할 수 있지만, 상태가 초기화되는 단점이 있습니다.

- [x] 새로고침을 하면 새로운 번들로 바뀐다.

### HMR

HMR은 전체 페이지를 다시 로드하지 않고 변경된 모듈만 업데이트합니다. 이는 변경 사항이 즉시 반영되고 애플리케이션의 상태를 유지함으로써 개발 효율성을 증가시킵니다. 하지만 모든 모듈이 HMR을 지원하지 않을 수 있으며, 구성이 더 복잡할 수 있습니다.

- [x] HMR을 연동 후 새로고침 없이 코드 수정시 바뀐 부분만 새로 로드
- [x] 플러그인 통한 단일 엔트리 상대경로 계산 및 자동 코드 삽입(custom loader)
- [ ] 동적 import 지원

### fast refresh

React Native에서 도입된 기능으로, HMR을 기반으로 하지만 개발자 경험을 개선하기 위해 추가적인 기능들을 제공합니다. Fast Refresh는 컴포넌트 상태를 유지하면서 React 컴포넌트를 실시간으로 업데이트합니다.

- [ ] react-refresh를 Webpack Custom Plugin으로 연동한다.

### 기타

- [ ] webpack이 생산한 빌드 결과물은 메모리에만 있다.
- [ ] Watch하는 범위에 특정 설정 파일들을 추가한다
- [ ] CLI 인터페이스 설계

## 공부할 것

- https://github.com/webpack/webpack/blob/main/hot/dev-server.js
- https://github.com/facebook/react/issues/16604#issuecomment-528663101
