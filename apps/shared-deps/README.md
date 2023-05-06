# Webpack Module Federation Shared Dependency Example

Webpack Module Federation 플러그인의 공유 의존성 예제입니다.

## 구성

- `mf-host` : 호스트, 앱 런처 역할을 하는 Micro App입니다.
- `mf-remote-1`: `mf-host`에서 불러와지는 Remote Micro App 1입니다.
- `mf-remote-1`: `mf-host`에서 불러와지는 Remote Micro App 2입니다.
- `mf-shared-pkg`: host와 remote 앱 모두가 공유하는 패키지입니다. npm 퍼블릭 레지스트리에 올라갑니다. 
  - 버전 문자열을 반환하는 함수, 그리고 버전이 올라갈수록 이전 버전에는 없는 구현체가 하나씩 추가됩니다.
  - `v1.0.3`: version() + add(덧셈)
  - `v1.0.4`: version() + add(덧셈) + sub(뺄셈)
  - `v1.0.5`: version() + add(덧셈) + sub(뺄셈) + mul(곱셈)
