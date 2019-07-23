FROM node:10

ENV TZ="/usr/share/zoneinfo/Asia/Seoul"
ENV HOST 0.0.0.0
ENV LANG=UTF8

ARG PROJECT_DIR=/prography/five-minutes/backend

##################################################
# Install Java Compiler
##################################################
RUN apt update
RUN apt upgrade -y
RUN apt install apt install default-jre -y
RUN apt install default-jdk -y

##################################################
# Project Files
##################################################
COPY . ${PROJECT_DIR}
WORKDIR ${PROJECT_DIR}
RUN npm install
RUN npm run build

EXPOSE 3000

# RUN npm run start
CMD ["npm", "start"]