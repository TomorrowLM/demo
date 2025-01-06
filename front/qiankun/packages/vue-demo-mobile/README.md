node<=16

当前是node18：
问题，由于 Node.js 版本与 OpenSSL 之间的兼容性问题引起的
解决，通过设置环境变量：set NODE_OPTIONS=--openssl-legacy-provider
"serve": "set NODE_OPTIONS=--openssl-legacy-provider && vue-cli-service serve --mode local",


