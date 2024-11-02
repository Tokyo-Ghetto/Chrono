FROM node:alpine

WORKDIR /app

COPY . /app/

RUN npm install
RUN npm run build

# RUN npm run import-etf_data
# RUN npm run init-etf-cache

# RUN chmod +x /app/init-db.sh
# CMD [/app/init-db.sh]

EXPOSE 3000

ENTRYPOINT npm run start
# CMD ["/bin/sh", "-c", "./init-db.sh && npm run start"]
