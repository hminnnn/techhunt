FROM node:12.18
WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

# remove unused folders
RUN rm -rf node_modules
RUN rm -rf src

EXPOSE 3000
CMD ["npx", "serve", "-s" ,"build", "-l" ,"3000"]