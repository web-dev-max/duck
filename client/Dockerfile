FROM node:22-alpine
WORKDIR /usr/src/app

RUN apk add curl

COPY package*.json ./

RUN npm install --force

COPY . .

#RUN npm run start:dev
#ENV NODE_ENV=production

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

RUN npm run build

ENV NODE_ENV=production
CMD ["npm", "run", "start"]
