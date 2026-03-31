const path = require("path");

function createHtmlWebpackPlugin({ safeRequire, htmlOptions }) {
  if (!safeRequire) {
    return null;
  }

  const HtmlWebpackPlugin = safeRequire("html-webpack-plugin");

  if (!HtmlWebpackPlugin) {
    return null;
  }

  return new HtmlWebpackPlugin(
    Object.assign(
      {
        template: path.join(process.cwd(), "public/index.html"),
        filename: "index.html",
        title: "react app",
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
        },
      },
      htmlOptions || {}
    )
  );
}

module.exports = createHtmlWebpackPlugin;