const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const MomentLocalesPlugin = require("moment-locales-webpack-plugin");

const packageConfig = require("./package");
const widgetName = packageConfig.widgetName;
const name = packageConfig.widgetName.toLowerCase();

const host = "http://localhost:8080";

const widgetConfig = {
    entry: `./src/components/${widgetName}Container.tsx`,
    output: {
        path: path.resolve(__dirname, "dist/tmp"),
        filename: `widgets/${packageConfig.packagePath}/${name}/${widgetName}.js`,
        libraryTarget: "umd"
    },
    devServer: {
        port: 3000,
        proxy: [
            {
                context: ["**", `!/widgets/${packageConfig.packagePath}/${name}/${widgetName}.js`],
                target: host,
                onError: function(err, req, res) {
                    if (res && res.writeHead) {
                        res.writeHead(500, {
                            "Content-Type": "text/plain"
                        });
                        if (err.code === "ECONNREFUSED") {
                            res.end(
                                "Please make sure that the Mendix server is running at " +
                                    host +
                                    " or change the configuration \n > npm config set transcript-editor:mendixhost http://host:port"
                            );
                        } else {
                            res.end("Error connecting to Mendix server" + "\n " + JSON.stringify(err, null, 2));
                        }
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js", ".tsx"],
        alias: {
            tests: path.resolve(__dirname, "./tests")
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            transpileOnly: true
                        }
                    }
                ]
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    // devtool: "eval",
    mode: "production",
    externals: ["react", "react-dom"],
    plugins: [
        new MomentLocalesPlugin(),
        new ForkTsCheckerWebpackPlugin(),
        new CopyWebpackPlugin(
            [
                {
                    from: "src/**/*.xml",
                    toType: "template",
                    to: "widgets/[name].[ext]"
                }
            ],
            { copyUnmodified: true }
        ) /*,
        new ExtractTextPlugin({ filename: `./widgets/${packageConfig.packagePath}/${name}/ui/${widgetName}.css` }),*/
    ]
};

const previewConfig = {
    entry: `./src/${widgetName}.webmodeler.tsx`,
    output: {
        path: path.resolve(__dirname, "dist/tmp"),
        filename: `widgets/${widgetName}.webmodeler.js`,
        libraryTarget: "commonjs"
    },
    resolve: {
        extensions: [".ts", ".js", ".tsx"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                options: {
                    compilerOptions: {
                        module: "CommonJS"
                    }
                }
            },
            { test: /\.css$/, use: "raw-loader" }
        ]
    },
    mode: "production",
    // devtool: "inline-source-map",
    externals: ["react", "react-dom"],
    plugins: [new MomentLocalesPlugin()]
};

module.exports = [widgetConfig, previewConfig];
