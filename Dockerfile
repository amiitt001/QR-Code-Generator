# --- Stage 1: Build the React App ---
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of your source code
COPY . .

# 1. Accept the build argument
ARG GEMINI_API_KEY

# 2. Write the key into .env.local BEFORE building
# We add "VITE_" prefix so your frontend code can access it
RUN echo "VITE_GEMINI_API_KEY=$GEMINI_API_KEY" > .env.local

# Build the project (creates the 'dist' folder)
RUN npm run build

# --- Stage 2: Serve with Nginx ---
FROM nginx:alpine

# Remove default nginx config and replace with ours
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build output from Stage 1 to Nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Cloud Run expects port 8080
EXPOSE 8080

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
