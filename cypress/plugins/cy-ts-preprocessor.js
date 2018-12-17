const wp = require("@cypress/webpack-preprocessor");

const webpackOptions = {
    resolve: {
        extensions: [".ts", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [{ loader: "ts-loader" }]
            }
        ]
    }
};

const options = {
    webpackOptions
};

module.exports = wp(options);
