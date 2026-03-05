# Build stage
FROM node:20-alpine AS builder
WORKDIR /build
ENV NODE_ENV=development

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies 
RUN npm ci --verbose 2>&1

# Copy all source code
COPY . .

# Build the application
RUN npm run build 2>&1

# Runtime stage
FROM nginx:1.27-alpine

# Copy nginx configuration
COPY docker/frontend-nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files to nginx
COPY --from=builder /build/dist /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
