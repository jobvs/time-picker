const cypressTypeScriptPreprocessor = require("./cy-ts-preprocessor");

module.exports = (on, config) => {
    on("file:preprocessor", cypressTypeScriptPreprocessor);

    if (config.env.suite === "mobile") {
        config.userAgent =
            "Mozilla/5.0 (Linux; Android 6.0.1; SM-G532G Build/MMB29T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.83 Mobile Safari/537.36";
        config.testFiles = "**/*.mobile.*";
        config.reporterOptions.mochaFile = config.reporterOptions.mochaFile.replace(".xml", "_mobile.xml");
    } else {
        config.ignoreTestFiles = "**/*.mobile.*";
    }

    return config;
};
