FROM node:18-alpine as builder

WORKDIR /app

# Clone the repository
RUN apk add --no-cache git && \
    git clone https://github.com/ens-pin/control-dashboard.git . && \
    apk del git

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Build the app
RUN pnpm build

# Use nginx to serve the static files
FROM nginx:alpine

# Copy the built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config if you have custom configuration
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx runs on port 80 by default
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 