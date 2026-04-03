const { buildFullPath } = require('./node_modules/axios/lib/core/buildFullPath');
const url = require('url');
console.log("axios: ", buildFullPath('http://localhost:4000/api/v1', '/auth/login'));
