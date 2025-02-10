mkdir -p "logs" && \
mkdir -p "dist" && \
yarn build-ts-es && \
node --enable-source-maps ./dist/index.js
