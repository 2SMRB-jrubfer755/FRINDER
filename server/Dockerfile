FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# Copy package files
COPY package.json package-lock.json ./

# Install ALL dependencies (ts-node is needed for runtime)
RUN npm cache clean --force && npm ci

# Copy source code
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nodeapp -u 1001
RUN chown -R nodeapp:nodejs /app
USER nodeapp

EXPOSE 5000

# Health check with better compatibility
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD npm run health || exit 1

CMD ["npm", "run", "start"]
