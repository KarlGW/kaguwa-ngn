# Use Node v8.5.0
FROM node:8.5.0

ENV NPM_CONFIG_LOGLEVEL=warn

ADD ./build /app

RUN cd /app; \
    npm install --only=production

USER node

EXPOSE 3000

CMD ["node", "/app/app.js"]