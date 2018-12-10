const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
/*const ExtractTextPlugin = require("extract-text-webpack-plugin");*/


const packageConfig = require("./package");
const widgetName = packageConfig.widgetName;
const name = packageConfig.widgetName.toLowerCase();

const host = "http://localhost:8080"

const widgetConfig = {
    entry: `./src/components/${widgetName}Container.tsx`,
    output: {
        path: path.resolve(__dirname, "dist/tmp"),
        filename: `widgets/${packageConfig.packagePath}/${name}/${widgetName}.js`,
        libraryTarget: "umd",
    },
    devServer: {
        port: 3000,
        proxy: [ {
            context: [ "**", `!/widgets/${packageConfig.packagePath}/${name}/${widgetName}.js` ],
            target: host,
            onError: function(err, req, res) {
                if (res && res.writeHead) {
                    res.writeHead(500, {
                        "Content-Type": "text/plain"
                    });
                    if (err.code === "ECONNREFUSED") {
                        res.end("Please make sure that the Mendix server is running at " + host
                            + " or change the configuration \n > npm config set transcript-editor:mendixhost http://host:port");
                    } else {
                        res.end("Error connecting to Mendix server"
                            + "\n " + JSON.stringify(err, null, 2));
                    }
                }
            }
        } ]
    },
    resolve: {
        extensions: [ ".ts", ".js", ".tsx" ],
        alias: {
            "tests": path.resolve(__dirname, "./tests")
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [{
                    loader: "ts-loader",
                    options: {
                        transpileOnly: true
                    }
                }]
            },
            /*{
                test: /\.(sa|sc|c)ss$/, loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader!sass-loader"
                })
            },*/
            {
                test: /\.(sa|sc|c)ss$/, use: [
                    "style-loader", "css-loader", "sass-loader"
                ]
            },
            { test: /\.png$/, loader: "url-loader?limit=100000" },
            { test: /\.jpg$/, loader: "file-loader" },
            {
                test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url-loader?limit=10000&mimetype=application/font-woff"
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url-loader?limit=10000&mimetype=application/octet-stream"
            },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader" },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url-loader?limit=10000&mimetype=image/svg+xml"
            }
        ]
    },
    devtool: "eval",
    mode: "development",
    externals: [ "react", "react-dom" ],
    plugins: [
        new ForkTsCheckerWebpackPlugin(),
        new CopyWebpackPlugin(
            [ {
                from: "src/**/*.xml",
                toType: "template",
                to: "widgets/[name].[ext]"
            } ],
            { copyUnmodified: true }
        )/*,
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
        extensions: [ ".ts", ".js", ".tsx" ]
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: "ts-loader", options: {
                compilerOptions: {
                    "module": "CommonJS",
                }
            }},
            { test: /\.css$/, use: "raw-loader" },
            { test: /\.scss$/, use: [
                    { loader: "raw-loader" },
                    { loader: "sass-loader" }
                ]
            }
        ]
    },
    mode: "development",
    devtool: "inline-source-map",
    externals: [ "react", "react-dom" ]
};

module.exports = [ widgetConfig, previewConfig ];
