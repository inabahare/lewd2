module.exports = {
    apps : [{
        name  : "lewd.se",
        script: "./dist/app.js",
        output: "./logs/app.out.log",
        error : "./logs/app.error.log",
        log   : "./logs/app.combined.outerr.log",
        env: {
            NODE_ENV: "production"
        },
        env_production : {
            NODE_ENV: "production"
        }
    }, {
        name: "Cron actions",
        script: "./dist/cronactions.js",
        output: "./logs/cron.out.log",
        error : "./logs/cron.error.log",
        log   : "./logs/cron.combined.outerr.log",
    }]
};
