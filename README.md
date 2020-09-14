# javascript-w3-todo
스프린트 3-4주차 웹 프로젝트 - 할일관리



## BE 프로그래밍 요구사항

- Node.js와 Express를 활용한다. [  ] 
- 프론트엔드 기능구현에 필요한 API를 제공한다. [  ]
- 템플릿 엔진보다는 json을 응답해주는 API형태로 구현한다. [  ]  
- MySQL을 사용하고 드라이버는 mysql2를 사용한다. ORM은 사용하지 않는다.[  ]  
- express-session을 사용해서 인증을 구현한다. passport는 사용하지 않는다.  [  ]  
- session은 메모리에 저장한다. 별도의 외부 저장장치를 사용하지 않는다.  [  ]  
- 배포는 클라우드 서버의 단일 인스턴스를 이용해서 배포를 진행한다.  [  ]  
- 배포시 깃의 tag를 적극적으로 활용하고, 자주 배포작업을 수행한다.  [  ]  
- <선택> 다사용자가 사용할 수 있도록 설계를 한다.  [  ]  
- <선택> 사용자별로 각 목록에 대한 접근권한 (읽기 / 쓰기) 제한 기능을 구현해 본다.  [  ]  



#### Task

- NCloud 배포
- Mysql생성 (NCloud)
- 로그인 기능 생성 (아이디 입력시 자동 등록, express-session인증)
- 기능 구현 (api)
  - get todoList (사용자 id별 할 일) => 쿠키와 세션을 사용하여 get방식으로 구현
  - post addTodo (노드 추가)
  - delete todo (노드 삭제)
  - put todo (내용, 타입 변경)
- Tables
  - User
    - id
    - role (읽기, 쓰기 권한)
  - Todo
    - id
    - type (todo, doing, done)
    - content
    - time
    - user_id (작성한 유저의 id)

### 1일차

- 과제 분석 및 환경설정
- NCloud배포 (Mysql설치까지)
- 데이터베이스 스키마 생성
- 로그인 기능 및 api 설계

### 2일차

- api설계
- 모듈화를 비롯한 코드 리펙토링
- backend 완료

### 3일차 ~

- backend점검 및 프론트엔드 시작

