# five-minutes backend

참 개발하자

하기 전에
1. VSCODE extension 설치
   - tslint
   - typescript  

프로젝트 설명
1. 디렉토리 구조
    - src: 소스파일
      - controllers: 서버 응답시 비즈니스 로직을 호출
      - models: 데이터베이스 모델 정의
      - repositories: 
      - services: 비즈니스 로직 정의
      - utils: utility의 성격을 띄는 파일 정의
      - test: 테스트코드 정의(나중에 만들 예정)
      - app.ts: 미들웨어, routes 정의
      - index.ts: 실제 어플리케이션 실행 파일
    - dist: 빌드된 어플리케이션