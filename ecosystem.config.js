module.exports = {
  apps : [{
    name      : 'lewd.se',
    script    : './build/app.js',
    env: {
      NODE_ENV: 'production'
    },
    env_production : {
      NODE_ENV: 'production'
    }
  }, {
    name: "Cron actions",
    script: "./build/cronactions.js"
  }]
};
