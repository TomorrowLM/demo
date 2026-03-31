function createMiniCssExtractPlugin({ safeRequire }) {
  if (!safeRequire) {
    return null;
  }

  const MiniCssExtractPlugin = safeRequire("mini-css-extract-plugin");

  if (!MiniCssExtractPlugin) {
    return null;
  }

  return new MiniCssExtractPlugin({
    filename: "css/[name].[hash].css",
    chunkFilename: "css/[name].[hash].css",
    ignoreOrder: true,
  });
}

module.exports = createMiniCssExtractPlugin;