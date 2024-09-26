# Use the official Node.js 14 image as the base image
FROM node:14

# Install PostgreSQL client to use psql
RUN apt-get update && apt-get install -y postgresql-client

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Rebuild bcrypt to avoid compatibility issues
RUN npm rebuild bcrypt --build-from-source

# Copy the rest of the application code
COPY . .

# Download wait-for-it script
ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /usr/local/bin/wait-for-it
RUN chmod +x /usr/local/bin/wait-for-it

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
