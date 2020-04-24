FROM node:alpine
RUN apk add git

COPY . /app
WORKDIR /app
RUN npm i

EXPOSE 8826

CMD ["node", "."]