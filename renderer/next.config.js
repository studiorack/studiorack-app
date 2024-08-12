// const package = require('./package.json')

console.log('NODE_ENV', process.env.NODE_ENV);
console.log('CI', process.env.CI);

export default {
  basePath: process.env.NODE_ENV === 'production' ? '' : '',
  generateBuildId: async () => {
    return 'latest'; // TODO version the site feed using package.version
  },
};
