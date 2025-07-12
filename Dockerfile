FROM node AS build

WORKDIR /workdir

COPY package*.json .

RUN npm i

COPY src src

COPY tsconfig.json .

RUN npm run build

FROM base

WORKDIR /app

COPY package*.json .

RUN npm ci 

COPY --from=build /workdir/dist/* ./ 

COPY ./startup.sh  ./

RUN chmod +x startup.sh

CMD ["/app/startup.sh"]

EXPOSE 5900