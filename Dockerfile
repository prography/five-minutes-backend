FROM node:10

ENV TZ="/usr/share/zoneinfo/Asia/Seoul"
ENV HOST 0.0.0.0

ARG PROJECT_DIR=/prography/five-minutes/backend

COPY . ${PROJECT_DIR}

WORKDIR ${PROJECT_DIR}

RUN npm install

RUN npm run build

EXPOSE 3000

# RUN npm run start
CMD ["npm", "start"]