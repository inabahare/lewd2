module.exports = {
    apps : [{
        name  : "lewd.se",
        script: "./packages/main-site/dist/index.js",
        output: "./logs/app.out.log",
        error : "./logs/app.error.log",
        log   : "./logs/app.combined.outerr.log",
        log_date_format : "YYYY-MM-DD HH:mm:ss.sssZ",
        env: {
            NODE_ENV: "development"
        },
        env_production : {
            NODE_ENV: "production"
        }
    }, {
        name: "Cron actions",
        script: "./packages/antivirus-services/dist/index.js",
        output: "./logs/cron.out.log",
        error : "./logs/cron.error.log",
        log   : "./logs/cron.combined.outerr.log",
        log_date_format : "YYYY-MM-DD HH:mm:ss.sssZ",
    }]
};
