# Use a Node.js base image
FROM node:14

# Set the working directory inside the container
WORKDIR /my_web_app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port your application listens on
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
