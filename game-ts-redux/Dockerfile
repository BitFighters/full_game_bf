# Use an official Node runtime as a parent image
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./

RUN yarn
COPY . .
EXPOSE 3001

# Build the app
# RUN npm run build

# Run npm start when the container launches
CMD ["npm", "run", "local"]
