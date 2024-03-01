FROM node:18 AS builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy source code into container
COPY . .

# Build the NestJS app
RUN npm run build

# Stage 2: Create the production image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy built files from the previous stage
COPY --from=builder /usr/src/app/dist ./dist
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Expose the port
EXPOSE 3000

# Start your Nest.js application
CMD ["node", "dist/src/main"]
