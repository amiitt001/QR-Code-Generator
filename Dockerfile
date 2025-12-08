# =======================================
# Stage 1: Build the React Application
# =======================================
FROM node:18-alpine as build

WORKDIR /app

# 1. Copy package files (Using wildcard * handles if lock file is missing)
COPY package*.json ./

# 2. Install dependencies
RUN npm install

# 3. Copy the rest of your source code
COPY . .

# 4. Handle the API Key at BUILD time
# React apps need environment variables baked in during the build
ARG GEMINI_API_KEY
ENV VITE_GEMINI_API_KEY=${GEMINI_API_KEY}
ENV REACT_APP_GEMINI_API_KEY=${GEMINI_API_KEY}

# 5. Build the app
# (This creates a 'dist' or 'build' folder)
RUN npm run build

# =======================================
# Stage 2: Serve with Nginx
# =======================================
FROM nginx:alpine

# 6. Copy the built artifacts from Stage 1
# NOTE: If your project uses Create-React-App, change '/app/dist' to '/app/build'
COPY --from=build /app/dist /usr/share/nginx/html

# 7. Copy your Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 8. Start Nginx
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]