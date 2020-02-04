FROM node:12

WORKDIR /test-harness-report-action
COPY . .
RUN yarn install --frozen-lockfile --non-interactive

CMD ["node", "/test-harness-report-action/main.js"]
