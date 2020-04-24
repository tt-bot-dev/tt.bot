FROM node:alpine

COPY . /app
WORKDIR /app
RUN npm i

EXPOSE 8826

CMD ["node", "."]