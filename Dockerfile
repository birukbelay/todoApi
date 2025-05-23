FROM node:20

# Create app directory
WORKDIR /app
# Install app dependencies
# A wildcard is used to ensure both package.json and package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Install all node modules
RUN npm install

# Bundle app source
COPY . .
RUN ls -l
# Build the project
RUN npm run build

# Your app binds to port 3000 so use the EXPOSE instruction
EXPOSE 3000

CMD [ "node", "dist/main"]