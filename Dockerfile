FROM node:alpine 

ENV NODE_ENV development

COPY . .

RUN npm install
RUN npm run build
RUN npm install -g serve

CMD ["serve", "build"]
