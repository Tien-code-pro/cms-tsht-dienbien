# Get the base image
FROM node:20.10-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
# Set working directory
WORKDIR /app

# Install the packages
COPY public ./public
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Copy environment deploy
COPY env.sh .
COPY .env .

# Make our shell script executable
RUN chmod +x /env.sh
RUN /env.sh

FROM base as builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Copy environment deploy
COPY .env .


# Get the production files ready
RUN yarn build

# Get the base image
FROM base as runner
WORKDIR /app
# Get the production files to the location  /app/build
COPY --from=builder /app/build/ ./build
COPY --from=deps /app/public/env-config.js ./build/configs

# Server for the application
RUN yarn global add serve

# Start app
CMD serve -s /app/build -l 3000