# javascript-w3-todo

스프린트 3-4주차 웹 프로젝트 - 할일관리

## 어떻게 구현할 것인가

* 스마트폰의 to do list app처럼 단순히 웹페이지가 아닌 어플리케이션처럼 동작하도록 구현한다
- Client Side Rendering 방식으로 만들면 좋을 것 같다

- 서버에서는 최소한의 html & js코드가 담긴 페이지만 보내주고 클라이언트에서는 페이지를 새로 요청하지 않고 rest api로만 서버와 통신하여 얻은 데이터를 통해 화면을 변경한다
- spa는 주로 토큰으로 인증을 구현하는데 이번 프로젝트는 세션을 그대로 사용해도 될것 같다
