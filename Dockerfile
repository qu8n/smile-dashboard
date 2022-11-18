FROM node:16.10.0
ADD ./ /smile-dashboard
WORKDIR /smile-dashboard
RUN yarn install
CMD ["yarn", "run", "start"]

