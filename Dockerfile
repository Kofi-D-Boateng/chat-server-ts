FROM node:18-alpine

WORKDIR /kdboat/app

COPY . .

RUN npm install && npm run build


CMD ["npm", "start"]