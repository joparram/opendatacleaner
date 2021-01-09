# node base image
FROM node:15.4.0-alpine
# create app
RUN mkdir -p /app
RUN whoami && ls -l
# working directory
WORKDIR /app
# expose angular port
EXPOSE 4200
COPY package.json /app/package.jso
COPY . ./
RUN npm install --production

# Development start command
CMD ["npm", "start"]
