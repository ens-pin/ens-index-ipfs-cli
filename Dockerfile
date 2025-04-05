# Use the latest Ubuntu LTS version as the base image
FROM node:18

# Set environment variables to avoid interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive
ENV VITE_API_URL=http://0.0.0.0:42069
ENV DATABASE_SCHEMA=my_schema

# Install global dependencies
RUN npm install -g pnpm@8.6.0 ens-index-ipfs-cli

# Set the working directory
WORKDIR /app

# Clone and install the IPFS service
RUN git clone https://github.com/ens-pin/ens-index-ipfs-service.git && \
    cd /app/ens-index-ipfs-service && \
    pnpm install

# Download and install IPFS
RUN ARCH=$(uname -m) && \
    if [ "$ARCH" = "x86_64" ]; then \
        wget https://dist.ipfs.tech/kubo/v0.34.1/kubo_v0.34.1_linux-amd64.tar.gz; \
    elif [ "$ARCH" = "aarch64" ]; then \
        wget https://dist.ipfs.tech/kubo/v0.34.1/kubo_v0.34.1_linux-arm64.tar.gz; \
    else \
        echo "Unsupported architecture: $ARCH" && exit 1; \
    fi && \
    tar -xvzf kubo_v0.34.1_linux-*.tar.gz && \
    rm kubo_v0.34.1_linux-*.tar.gz && \
    cd /app/kubo* && \
    ./install.sh && \
    ipfs init

# Clone and install the control dashboard
RUN git clone https://github.com/ens-pin/control-dashboard.git && \
    cd /app/control-dashboard && \
    pnpm install

# Start the services
CMD ["sh", "-c", "ipfs daemon & cd /app/ens-index-ipfs-service && pnpm run start & cd /app/control-dashboard && pnpm dev --host 0.0.0.0"]