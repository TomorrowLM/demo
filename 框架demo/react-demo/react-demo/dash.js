      // {
      //   test: /\.(png|gif|bmp|jpg)$/,
      //   use: {
      //     loader: "file-loader",
      //     options: {
      //       name: "[name].[ext]",
      //       outputPath: "assets/",//图片打包的出口
      //       publicPath: './src/assets/'//打包后img标签src的根级路径
      //     }
      //   },
      //   include: [path.resolve(__dirname, "./src/assets")],
      // },

      {
        test: /\.(jpg|png|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8 * 1024,
              name: '[hash:10].[ext]',
              esModule: false,
            },
          }
        ],
        type: 'javascript/auto',
      },