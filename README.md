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
      - routes/: 앱 접근 url 정의
      - services/: 비즈니스 로직 정의
      - utils/: util의 성격을 띄는 파일
      - tests/: 테스트 코드 정의(나중에 쓸 예정)
      - app.ts: middleware, routes 정의
      - index.ts: 실제 어플리케이션 실행 파일
    - dist: 빌드된 어플리케이션