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
ENV PUBLIC_URL="/dashboard"
COPY package*.json ./
RUN npm install
RUN npm install serve
COPY . .
RUN rm -rf build
RUN PUBLIC_URL=$PUBLIC_URL npm run build
RUN mkdir build/dashboard
RUN cp -ar build/static/ build/dashboard/
CMD ["npx", "-y", "serve" , "-s", "build"]
