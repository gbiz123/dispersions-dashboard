#FROM node:alpine 
#
#ENV NODE_ENV development
#
#COPY . .
#
#RUN npm install
#RUN npm run build
#RUN npm install -g serve
#
#CMD ["serve", "build"]
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN rm -rf build
RUN npm run build
 
# Production Stage
FROM nginx:stable-alpine AS production
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
