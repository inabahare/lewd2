const webpack = require("webpack");
const path = require("path");

module.exports = {
    entry: "./Public/JS/main.js",
    output: {
        path: path.resolve(__dirname, "Public/JS"),
        filename: "bundle.js"
    },
    module: {
        rules: [{
            test: /\.less$/,
            use: [{
                loader: "style-loader"
            }, {
                loader: "css-loader"
            }, {
                loader: "less-loader",
                options: {
                    strictMath: true
                }
            }],
        }],
    },
};