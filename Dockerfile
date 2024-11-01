FROM node:alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

COPY init-db.sh ./init-db.sh
RUN chmod +x ./init-db.sh

EXPOSE 3000
CMD ["/bin/sh", "-c", "./init-db.sh && npm run start"]