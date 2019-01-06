module.exports = {
    apps : [{
        name  : "lewd.se",
        script: "./dist/app.js",
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
        script: "./dist/cronactions.js",
        output: "./logs/cron.out.log",
        error : "./logs/cron.error.log",
        log   : "./logs/cron.combined.outerr.log",
        log_date_format : "YYYY-MM-DD HH:mm:ss.sssZ",
        
    }]
};
