FROM node:16.10.0
ADD ./ /server
WORKDIR /server
RUN sed -i 's/deb.debian.org/archive.debian.org/g' /etc/apt/sources.list \
  && sed -i 's|security.debian.org/debian-security|archive.debian.org/debian-security|g' /etc/apt/sources.list \
  && echo 'Acquire::Check-Valid-Until "false";' > /etc/apt/apt.conf.d/99no-check-valid-until \
  && apt-get update \
  && apt-get install -y --allow-unauthenticated libaio1
RUN yarn
RUN yarn build:backend
CMD ["yarn", "start:backend"]
