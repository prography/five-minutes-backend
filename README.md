# five-minutes backend

참 개발하자

하기 전에
1. VSCODE extension 설치
   - tslint
   - typescript  

프로젝트 설명
1. 디렉토리 구조
    - src: 소스파일
      - controllers/: 서버 응답시 비즈니스 로직을 호출
      - models/: 데이터베이스 모델 정의
      - repositories/: 데이터베이스 접근 로직
      - middlewares/: 미들웨어 정의
      - services/: 비즈니스 로직 정의
      - utils/: util의 성격을 띄는 파일
      - tests/: 테스트 코드 정의(나중에 쓸 예정)
      - app.ts: middleware, routes 정의
      - index.ts: 실제 어플리케이션 실행 파일
    - dist: 빌드된 어플리케이션
    
    
## 호출 순서

request => app(middleware) => route(resolve url) => controller => (service(business logic) => repository(database)) => response

쉽게 말하면 요청이 들어오면 app middleware(Sentry, body-parser, morgan 등)을 거치고 route를 호출, route는 알맞는 url에 맞춰서 컨트롤러 호출, 컨트롤러에서 역할은 validation, service 호출, response formatting 역할 수행후 response 반환, service(=business logic) 내부에서 데이터베이스 건드리면서 로직 수행한다.
