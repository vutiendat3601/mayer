FROM node:16

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN mkdir /usr/src/app/node_modules
RUN chown node:node /usr/src/app/node_modules

EXPOSE 3000

USER node

CMD ["/bin/bash", "-c", "npm install && npm run start"]
