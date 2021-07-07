module.exports = {
    entry: {
        // index: "./src/index.js",
    },
    output: {
        // path: _dirname + "/dist/",
        // filename: "[name].js"
    },
    resolve: {
        extensions: ['.js', '.vue', '.json']
    },
    module: {
         rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loaders: [
                        'eslint-loader'
                    ]
                },
                {
                    test: /\.vue|\.js$/,
                    enforce: 'pre',  // 在babel-loader对源码进行编译前进行lint的检查
                    include: /./,  // src文件夹下的文件需要被lint
                    use: [{
                        loader: 'eslint-loader',
                        options: {
                            formatter: require('eslint-friendly-formatter')   // 编译后错误报告格式
                        }
                    }]
                }
            ]
    }
}