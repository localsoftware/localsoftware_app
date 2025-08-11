FROM node:10

WORKDIR /app/

COPY package.json package.json

COPY yarn.lock yarn.lock
RUN yarn --pure-lockfile  --ignore-optional

COPY . .

RUN yarn build

ENV HOST=0.0.0.0
ENV PORT=3333
EXPOSE 3333

ENTRYPOINT [ "yarn", "start" ]