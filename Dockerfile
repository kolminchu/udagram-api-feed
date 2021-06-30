FROM node:13

#create the working directory
WORKDIR /usr/src/app

COPY package*json  ./

RUN npm install

COPY ./www/ .

EXPOSE 8080

CMD ["npm", "run", "start"]
