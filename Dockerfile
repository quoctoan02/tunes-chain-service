# Create base
FROM node:16-alpine
LABEL author="ductnn"

ENV __SERVICE_NAME__=""

WORKDIR /anim
COPY package*.json ./

RUN npm ci \
    && npm cache verify \
    && npm cache clean --force

COPY . .

ENTRYPOINT [ "npm", "start" ]
