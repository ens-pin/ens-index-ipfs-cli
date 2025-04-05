FROM node:18-alpine

WORKDIR /app

# Clone the repository and checkout weihup branch
RUN apk add --no-cache git && \
    git clone -b weihup https://github.com/ens-pin/ens-index-ipfs-service.git . && \
    apk del git

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Start the service
CMD ["pnpm", "start"] 