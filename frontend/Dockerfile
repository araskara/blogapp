# Build Stage
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production Stage
FROM nginx:alpine

# Copy built assets from builder
COPY --from=build /app/dist /usr/share/nginx/html

# Default port to 80
ENV PORT=80

# Add nginx config template to handle React Router and dynamic PORT
# Nginx image automatically substitutes vars in /etc/nginx/templates/*.template
RUN mkdir -p /etc/nginx/templates
RUN echo 'server { \
    listen ${PORT}; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/templates/default.conf.template

# Delete default config to ensure template is used
RUN rm /etc/nginx/conf.d/default.conf

EXPOSE ${PORT}

CMD ["nginx", "-g", "daemon off;"]
