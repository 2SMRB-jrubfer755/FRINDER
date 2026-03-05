# Build stage
FROM node:20 AS builder
WORKDIR /build

# Copy package files
COPY package.json ./

# Install dependencies - reinstall clean sin lock file
RUN npm cache clean --force && \
    rm -f package-lock.json && \
    npm install

# Copy all source code
COPY . .

# Build the application
RUN npm run build

# Runtime stage
FROM nginx:1.27-alpine

# Install wget for healthcheck
RUN apk add --no-cache wget

# Copy nginx configuration
COPY docker/frontend-nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files to nginx
COPY --from=builder /build/dist /usr/share/nginx/html/

EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
