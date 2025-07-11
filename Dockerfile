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
COPY package*.json ./
RUN npm install
RUN npm install serve
COPY . .
RUN rm -rf build
RUN npm run build
CMD ["npx", "-y", "serve" , "-s", "build"]
