FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install

COPY backend/docker/container-start.sh /usr/local/bin/container-start.sh
RUN sed -i 's/\r$//' /usr/local/bin/container-start.sh \
	&& chmod +x /usr/local/bin/container-start.sh

COPY frontend/ ./

EXPOSE 3000

CMD ["/usr/local/bin/container-start.sh"]
