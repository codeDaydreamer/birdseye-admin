# Use Node.js LTS image as base
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app files
COPY . .

# Build the Nuxt 3 app for production
RUN npm run build

# Expose the port your Nuxt app runs on (default 3000)
EXPOSE 3000

# Start the app in true production mode
CMD ["node", ".output/server/index.mjs"]
