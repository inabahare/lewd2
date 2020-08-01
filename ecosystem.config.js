module.exports = {
    apps: [{
        name: "lewd.se",
        script: "./packages/main-site/dist/index.js",
        node_args: "-r dotenv/config",
        output: "./logs/app.out.log",
        error: "./logs/app.error.log",
        log: "./logs/app.combined.outerr.log",
        log_date_format: "YYYY-MM-DD HH:mm:ss.sssZ",
        env: {
            dotenv_config_path: ".env"
        },
    }, {
        name: "Cron actions",
        script: "./packages/antivirus-services/dist/index.js",
        node_args: "-r dotenv/config",
        env: {
            dotenv_config_path: ".env"
        },
        output: "./logs/cron.out.log",
        error: "./logs/cron.error.log",
        log: "./logs/cron.combined.outerr.log",
        log_date_format: "YYYY-MM-DD HH:mm:ss.sssZ",
    }, {
        name: "Discord bot",
        script: "./packages/discord/dist/index.js",
        node_args: "-r dotenv/config",
        env: {
            dotenv_config_path: ".env"
        },
        output: "./logs/discord.out.log",
        error: "./logs/discord.error.log",
        log: "./logs/discord.combined.outerr.log",
        log_date_format: "YYYY-MM-DD HH:mm:ss.sssZ",
    }]
};
