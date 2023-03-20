FROM node:14
RUN mkdir -p /home/nodejs/app
WORKDIR /home/nodejs/app
COPY . /home/nodejs/app
EXPOSE 8080
CMD ["npm", "run", "deploy"]