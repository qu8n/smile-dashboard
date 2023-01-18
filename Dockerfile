FROM node:16.10.0
ADD ./ /smile-dashboard
WORKDIR /smile-dashboard
RUN yarn --cwd frontend install
CMD ["yarn", "run", "dev:frontend"]

