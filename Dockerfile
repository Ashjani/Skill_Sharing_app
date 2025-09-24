FROM node:20-alpine
WORKDIR /app

# Copy only deps first for better caching
COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

# Copy source
COPY . .

ENV NODE_ENV=production
# Skip DB inside the container for your demo; remove later if you compose Mongo
ENV SKIP_DB=true

EXPOSE 3000
CMD ["npm", "start"]
