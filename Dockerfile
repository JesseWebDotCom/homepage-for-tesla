# Base image
FROM node:14-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy app files
COPY . .

# Build the app
RUN npm run build

# Set the command to start the app
CMD ["npm", "start"]
