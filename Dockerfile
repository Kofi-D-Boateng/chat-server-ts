FROM node:18-alpine

WORKDIR /kdboat/app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]