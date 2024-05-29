# Use Node.js 18 as the base image
FROM node:18

# Install tzdata to set the timezone
RUN apt-get update && apt-get install -y tzdata

# Set the timezone environment variable
ENV TZ=Asia/Dhaka

# Link the timezone data
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .

# Debugging step to list files in the working directory
RUN ls -la

# Expose the port your app runs on
EXPOSE 3000

# Command to run your application
CMD ["node", "index.js"]
