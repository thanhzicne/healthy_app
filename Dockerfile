FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY public ./public
COPY src ./src

RUN npm run build

FROM node:20-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/build ./build
COPY docker/frontend-entrypoint.sh ./frontend-entrypoint.sh

RUN chmod +x ./frontend-entrypoint.sh

ENV PORT=3000

EXPOSE 3000

CMD ["./frontend-entrypoint.sh"]
