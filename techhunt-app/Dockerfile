FROM node:12.18
WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build
# only copy build
EXPOSE 3000
CMD ["npx", "serve", "-s" ,"build", "-l" ,"3000", "&&", "set" ,"NODE_ENV=dev"]