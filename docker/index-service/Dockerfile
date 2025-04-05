FROM node:18-alpine

WORKDIR /app

# Add build argument for cache busting
ARG CACHEBUST=1

# Clone the repository and checkout weihup branch with no cache
RUN apk add --no-cache git && \
    git clone https://github.com/ens-pin/ens-index-ipfs-service.git . && \
    apk del git

# Install pnpm
RUN npm install -g pnpm

# Clean install dependencies
RUN pnpm install --force

# Expose the port that Ponder uses
EXPOSE 42069

# Start the service
CMD ["pnpm", "start"] 