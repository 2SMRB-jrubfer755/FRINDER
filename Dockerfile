# Build stage
FROM node:20-alpine AS builder
WORKDIR /build
ENV NODE_ENV=production

# Copy package files
COPY package.json package-lock.json ./

# Install ALL dependencies - use npm install which is more tolerant
RUN npm cache clean --force && npm install --verbose

# Copy all source code
COPY . .

# Verify vite is installed
RUN ls -la node_modules/.bin/vite || echo "WARNING: vite not found!"

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
