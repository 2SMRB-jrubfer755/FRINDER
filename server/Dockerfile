FROM node:20
WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies - clean install without lock file
RUN npm cache clean --force && \
    rm -f package-lock.json && \
    npm install

# Copy source code
COPY . .

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD npm run health || exit 1

CMD ["npm", "run", "start"]
