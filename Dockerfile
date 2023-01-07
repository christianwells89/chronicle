# Currently does not work because the middleware is buggy on React 18. Need to update next in order
# to fix it

# Use 16-alpine3.16 instead of 16-alpine because of an issue with OpenSSL and prisma. Once prisma is
# updated to 4.8.0 this will no longer be needed and can be changed back.
# See https://github.com/prisma/prisma/issues/16553

# Install dependencies only when needed
FROM node:16-alpine3.16 AS deps
WORKDIR /app

COPY package.json yarn.lock* ./
RUN yarn --frozen-lockfile

# Rebuild the source code only when needed
FROM node:16-alpine3.16 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .


# Ordinarily this would happen on install of node module, but the code wasn't in the deps stage
RUN yarn prisma generate
RUN yarn build

# Production image, copy all the files and run next
FROM node:16-alpine3.16 AS runner

RUN mkdir /data
VOLUME /data
ENV DATABASE_URL /data/database.sqlite

WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]