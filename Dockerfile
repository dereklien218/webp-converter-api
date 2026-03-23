FROM node:18

# Install WebP tools
RUN apt-get update && apt-get install -y webp

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app code
COPY . .

# Expose port
EXPOSE 10000

# Start server
CMD ["node", "server.js"]