FROM node:18



# Create app directory
WORKDIR /usr/src/app


# Install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Copy source code into container
COPY . .

# Copy the .env
COPY .env ./

# Build the NestJS app
RUN npm run build


# the port  Nest.js application will run on
EXPOSE 3000

# Start your Nest.js application
CMD ["npm", "run", "start:prod"]