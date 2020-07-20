FROM node:alpine
RUN apk add git python2

ENV HOME /app
COPY . /app
WORKDIR /app
RUN npm i
USER nobody

EXPOSE 8826

CMD ["node", "."]
