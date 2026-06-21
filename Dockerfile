FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:22-alpine AS app
ENV NODE_ENV=production
WORKDIR /app
RUN addgroup -S lue && adduser -S lue -G lue
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN mkdir -p /app/uploads && chown -R lue:lue /app
USER lue
EXPOSE 3000
CMD ["node", "src/server.js"]
