FROM node:16.10.0
ADD ./ /server
WORKDIR /server
RUN apt-get update && apt-get install -y libaio1
RUN yarn
RUN yarn build:backend
CMD ["yarn", "start:backend"]
