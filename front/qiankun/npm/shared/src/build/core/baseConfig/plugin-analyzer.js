const path = require("path");

function createBundleAnalyzerPlugin({ safeRequire, appPath }) {
	if (!safeRequire || !appPath) {
		return null;
	}

	const analyzerPackage = safeRequire("webpack-bundle-analyzer");
	const BundleAnalyzerPlugin = analyzerPackage
		&& (analyzerPackage.BundleAnalyzerPlugin || analyzerPackage.BundleAnalyzer);

	if (!BundleAnalyzerPlugin) {
		return null;
	}

	return new BundleAnalyzerPlugin({
		analyzerMode: "static",
		openAnalyzer: false,
		reportFilename: path.resolve(appPath, "$lm-config/bundle-report.html"),
	});
}

module.exports = createBundleAnalyzerPlugin;
