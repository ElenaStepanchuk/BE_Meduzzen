FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run start:prod
EXPOSE 8080
CMD ["npm", "run", "start"]
