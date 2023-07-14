FROM node:alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY index.js prompts.csv README.md
CMD ["node", "index.js"]
