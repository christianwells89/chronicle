ARG NODE_VERSION="18.13.0"
ARG ALPINE_VERSION="3.17"

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS base

# Set for base and all layers that inherit from it
ENV NODE_ENV="production"

RUN apk --update-cache add sqlite && rm -rf /var/cache/apk/*

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

COPY package.json yarn.lock* .yarnrc.yml ./
# Should use the version specified in package.json that was just copied
RUN corepack enable yarn && yarn -v
RUN yarn --immutable

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .


# Ordinarily this would happen on install of node modules, but the code wasn't in the deps stage
RUN yarn prisma generate
RUN yarn build

# Production image, copy all the files and run next
FROM base AS runner

ENV DATABASE_FILE="/data/database.sqlite"
ENV DATABASE_URL="file:${DATABASE_FILE}"
ENV PORT="3000"

RUN mkdir -m 0777 /data
VOLUME /data

RUN sqlite3 ${DATABASE_FILE} "VACUUM;"
RUN chmod a+rw ${DATABASE_FILE}

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs --chmod=700 /app/docker/startup.sh ./

COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE ${PORT}

CMD ./startup.sh