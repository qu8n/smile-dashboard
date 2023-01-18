FROM node:16.10.0
ADD ./ /server
WORKDIR /server
RUN yarn --cwd graphql-server install
RUN yarn build:backend
CMD ["yarn", "start:backend"]
