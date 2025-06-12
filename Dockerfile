FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json tsconfig.json ./

RUN npm install --frozen-lockfile

COPY . .

RUN npm run build

FROM node:22-alpine

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json

EXPOSE 3000

CMD ["npm", "run", "start:dev"]