FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular application
RUN npm run build

# Stage 2 - Serve the application with Nginx
FROM nginx:alpine

# Copy the built application from the previous stage
COPY --from=build /app/dist/ngAccountAnt /usr/share/nginx/html

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
