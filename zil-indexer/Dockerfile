FROM node:12

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i
COPY . .
CMD [ "/usr/local/bin/npm", "run", "server" ]