FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# Copy package files
COPY package.json package-lock.json ./

# Install ALL dependencies - use npm install for robustness
RUN npm cache clean --force && npm install

# Copy source code
COPY . .

# Verify ts-node is installed
RUN ls -la node_modules/.bin/ts-node || echo "WARNING: ts-node not found!"

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nodeapp -u 1001
RUN chown -R nodeapp:nodejs /app
USER nodeapp

EXPOSE 5000

# Health check with better compatibility
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD npm run health || exit 1

CMD ["npm", "run", "start"]
