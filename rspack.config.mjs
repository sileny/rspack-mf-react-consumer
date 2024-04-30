import rspack from "@rspack/core";
import refreshPlugin from "@rspack/plugin-react-refresh";
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from "node:url";
import { createRequire } from 'node:module';
import { ModuleFederationPlugin } from "@module-federation/enhanced/rspack";

const isDev = process.env.NODE_ENV === "development";
const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

const name = "customer";
const port = 3003;

const plugins = [
  new rspack.HtmlRspackPlugin({
    template: "./index.html",
    // excludedChunks: [name],
    filename: "index.html",
    inject: true,
    publicPath: "/",
  }),
  new ModuleFederationPlugin({
    name: "host",
    filename: 'remoteEntry.js',
    remotes: {
      provider: "provider@http://localhost:3000/mf-manifest.json",
    },
    shared: {
      "react": {
        "singleton": true
      },
      "react-dom": {
        "singleton": true
      },
    },
  }),
];

if (isDev) {
  plugins.push(
    new rspack.HotModuleReplacementPlugin(),
    new refreshPlugin(),
  );
}

module.exports = {
  //context: __dirname,
  entry: {
    main: resolve(__dirname, "./src/index.tsx"),
  },
  resolve: {
    extensions: ["...", ".ts", ".tsx", ".jsx"],
  },
  devServer: {
    port,
    hot: true,
    static: {
      directory: join(__dirname, "dist"),
    },
    liveReload: false,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
    },
  },
  devtool: "source-map",
  optimization: { minimize: false },
  dev: {
    // 必须要配置 assetPrefix，在生产环境需要配置 output.assetPrefix
    assetPrefix: `http://localhost:${port}`,
  },
  output: {
    // mf必须
    publicPath: `http://localhost:${port}/`,
    path: join(__dirname, "build"),
    uniqueName: name,
    filename: "[name].js",
  },
  watch: true,
  module: {
    rules: [
      {
        test: /\.(jsx?|tsx?)$/,
        exclude: /(node_modules|\.webpack)/,
        use: [
          {
            loader: "builtin:swc-loader",
            options: {
              sourceMap: true,
              jsc: {
                parser: {
                  syntax: "typescript",
                  tsx: true,
                },
                transform: {
                  react: {
                    runtime: "automatic",
                    development: isDev,
                    refresh: isDev,
                  },
                },
              },
              env: {
                targets: ["chrome >= 87", "edge >= 88", "firefox >= 78", "safari >= 14"],
              },
            },
          },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              implementation: require("sass"),
            },
          },
        ],
        type: 'css/auto', // 如果你需要将 '*.module.(sass|scss)' 视为 CSS Module 那么将 'type' 设置为 'css/auto' 否则设置为 'css'
      },
    ],
  },
  plugins,
};
