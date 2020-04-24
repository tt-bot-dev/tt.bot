FROM node:alpine
RUN apk add git

USER nobody
COPY . /app
WORKDIR /app
RUN npm i

EXPOSE 8826

CMD ["node", "."]