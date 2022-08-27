FROM node:18-alpine as build-stage

WORKDIR /kdboat/app

COPY . .

RUN npm install -g typescript
RUN npm install -g ts-node
RUN npm install && npm run build

FROM node:18-alpine

WORKDIR /user/app

COPY --from=build-stage /kdboat/app/dist ./dist
COPY --from=build-stage /kdboat/app/package.json .

RUN npm install

CMD ["npm", "start"]