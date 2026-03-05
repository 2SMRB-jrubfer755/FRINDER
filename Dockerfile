# Build stage
FROM node:20-alpine AS builder
WORKDIR /build
ENV NODE_ENV=production

# Copy package files
COPY package.json package-lock.json ./

# Clean npm cache and install dependencies
RUN npm cache clean --force && npm ci --only=production --verbose

# Copy all source code
COPY . .

# Build the application with production mode
RUN npm run build

# Runtime stage
FROM nginx:1.27-alpine

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy nginx configuration
COPY docker/frontend-nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files to nginx
COPY --from=builder /build/dist /usr/share/nginx/html/

# Add healthcheck endpoint
RUN echo 'server { listen 80; location /health { return 200 "healthy\n"; } }' > /etc/nginx/conf.d/health.conf

EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
