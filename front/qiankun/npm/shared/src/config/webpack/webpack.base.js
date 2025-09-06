/**
 * @lm/shared webpack 配置构建器
 * 此模块提供了一个可配置的 webpack 设置，允许用户按需导入和使用特定的插件和加载器。
 * This module provides a configurable webpack setup that allows users to
 * import and use specific plugins and loaders on demand.
 */

/**
 * 检查依赖是否已安装且可用
 * Check if a dependency is installed and available
 * @param {string} packageName - 要检查的包名称
 * @returns {boolean} - 包是否可用
 */
function checkDependency(packageName) {
  try {
    require.resolve(packageName);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * 获取缺失依赖的友好错误消息
 * Get a helpful error message for missing dependencies
 * @param {string} packageName - 缺失的包名称
 * @returns {string} - 包含安装指南的格式化错误消息
 */
function getMissingDependencyMessage(packageName) {
  return `Missing required dependency: ${packageName}\n` +
    `Please install it using your package manager:\n` +
    `npm install --save-dev ${packageName}\n` +
    `or\n` +
    `yarn add --dev ${packageName}\n` +
    `or\n` +
    `pnpm add --save-dev ${packageName}`;
}

/**
 * Webpack 配置构建器类
 * 用于创建和管理 webpack 配置，支持按需添加插件和加载器
 */
class WebpackConfigBuilder {
  /**
   * 构造函数，初始化配置构建器
   */
  constructor() {
    this.config = {};
    this.initialized = false;
    
    // 环境变量 (Environment variables)
    this.isDev = process.env.NODE_ENV === 'development';  // 是否为开发环境
    this.isProd = process.env.NODE_ENV === 'production';  // 是否为生产环境
    this.isAnalyze = process.env.ANALYZE === 'true';      // 是否开启打包分析
    this.isQiankun = process.env.QIANKUN === 'true';      // 是否为乾坤微前端环境
    this.isQiankunSlave = process.env.QIANKUN_SLAVE === 'true';    // 是否为乾坤子应用
    this.isQiankunMaster = process.env.QIANKUN_MASTER === 'true';  // 是否为乾坤主应用
    this.isQiankunMasterProd = this.isQiankunMaster && this.isProd;  // 乾坤主应用生产环境
    this.isQiankunSlaveProd = this.isQiankunSlave && this.isProd;    // 乾坤子应用生产环境
    this.isQiankunProd = this.isQiankun && this.isProd;    // 乾坤生产环境
    this.isQiankunDev = this.isQiankun && this.isDev;      // 乾坤开发环境
    this.isQiankunMasterDev = this.isQiankunMaster && this.isDev;  // 乾坤主应用开发环境
    this.isQiankunSlaveDev = this.isQiankunSlave && this.isDev;    // 乾坤子应用开发环境
    
    // 路径设置 (Path settings)
    this.publicPath = process.env.PUBLIC_PATH || '/';  // 公共路径
    this.outputPath = process.env.OUTPUT_PATH || 'dist';  // 输出路径
    this.port = process.env.PORT || 8000;  // 开发服务器端口
    
    // 插件和加载器的注册表 (Registry for plugins and loaders)
    this.pluginsRegistry = {};  // 插件注册表
    this.loadersRegistry = {};  // 加载器注册表
    
    // 注册所有可用的插件 (Register all available plugins)
    this.registerPlugins();
    
    // 注册所有可用的加载器 (Register all available loaders)
    this.registerLoaders();
  }
  
  /**
   * 初始化基础配置
   * Initialize the base configuration
   * @returns {WebpackConfigBuilder} - 返回 this 以支持链式调用
   */
  init() {
    if (this.initialized) return this;
    
    // 检查 webpack 依赖是否已安装 (Check for webpack dependency)
    if (!checkDependency('webpack')) {
      throw new Error(getMissingDependencyMessage('webpack'));
    }
    
    const path = require('path');
    const webpack = require('webpack');
    let packageJson;
    
    // 尝试读取项目的 package.json 文件
    try {
      packageJson = require(path.resolve(process.cwd(), 'package.json'));
    } catch (e) {
      packageJson = { name: 'app' }; // 如果读取失败，使用默认值
    }
    
    // 获取应用名称，优先使用环境变量中的 APP_NAME
    const appName = process.env.APP_NAME || packageJson.name;
    
    // 获取客户端环境变量 (Get environment variables)
    const getClientEnvironment = () => {
      // 原始环境变量对象
      const raw = {
        NODE_ENV: process.env.NODE_ENV || 'development',
        PUBLIC_PATH: this.publicPath,
        OUTPUT_PATH: this.outputPath,
        APP_NAME: appName,
        PORT: this.port,
        QIANKUN: this.isQiankun,
        QIANKUN_SLAVE: this.isQiankunSlave,
        QIANKUN_MASTER: this.isQiankunMaster,
      };

      // 将环境变量转换为字符串形式，用于 DefinePlugin
      const stringified = {
        'process.env': Object.keys(raw).reduce((env, key) => {
          env[key] = JSON.stringify(raw[key]);
          return env;
        }, {}),
      };

      return { raw, stringified };
    };

    const env = getClientEnvironment();
    
    // 创建基础配置 (Create base configuration)
    this.config = {
      // 模式：开发环境或生产环境
      mode: this.isDev ? 'development' : 'production',
      // 入口文件
      entry: './src/index',
      // 输出配置
      output: {
        // 输出路径
        path: path.resolve(process.cwd(), this.outputPath),
        // 公共路径
        publicPath: this.publicPath,
        // 文件名格式，生产环境使用内容哈希
        filename: this.isDev ? '[name].js' : '[name].[contenthash:8].js',
        // 代码分割后的文件名格式
        chunkFilename: this.isDev ? '[name].chunk.js' : '[name].[contenthash:8].chunk.js',
        // 资源文件名格式
        assetModuleFilename: 'assets/[name].[hash][ext]',
        // 构建前清空输出目录
        clean: true,
      },
      // 开发工具：开发环境使用 source map
      devtool: this.isDev ? 'cheap-module-source-map' : false,
      // 开发服务器配置
      devServer: {
        // 端口
        port: this.port,
        // 热更新
        hot: true,
        // 支持 HTML5 History API
        historyApiFallback: true,
        // 启用 gzip 压缩
        compress: true,
        // 客户端配置
        client: {
          // 错误覆盖层
          overlay: {
            errors: true,    // 显示错误
            warnings: false, // 不显示警告
          },
        },
      },
      // 插件数组
      plugins: [],
      // 解析配置
      resolve: {
        // 自动解析的扩展名
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        // 路径别名
        alias: {
          '@': path.resolve(process.cwd(), 'src'),
        },
        // 回退配置，禁用某些 Node.js 核心模块
        fallback: {
          fs: false,
          path: false,
          crypto: false,
        },
      },
      // 模块配置
      module: {
        // 规则数组
        rules: [],
      },
    };
    
    this.initialized = true;
    return this;
  }
  
  /**
   * 注册所有可用的插件
   * Register all available plugins
   */
  registerPlugins() {
    // WebpackBar plugin
    this.pluginsRegistry.WebpackBar = () => {
      if (!checkDependency('webpackbar')) {
        throw new Error(getMissingDependencyMessage('webpackbar'));
      }
      const WebpackBar = require('webpackbar');
      return new WebpackBar();
    };
    
    // HtmlWebpackPlugin
    this.pluginsRegistry.HtmlWebpackPlugin = (options = {}) => {
      if (!checkDependency('html-webpack-plugin')) {
        throw new Error(getMissingDependencyMessage('html-webpack-plugin'));
      }
      const HtmlWebpackPlugin = require('html-webpack-plugin');
      const path = require('path');
      let packageJson;
      
      try {
        packageJson = require(path.resolve(process.cwd(), 'package.json'));
      } catch (e) {
        packageJson = { name: 'app' };
      }
      
      const defaultOptions = {
        template: './public/index.html',
        filename: 'index.html',
        title: packageJson.name,
        inject: true,
        minify: this.isProd,
      };
      
      return new HtmlWebpackPlugin(Object.assign({}, defaultOptions, options));
    };
    
    // MiniCssExtractPlugin
    this.pluginsRegistry.MiniCssExtractPlugin = (options = {}) => {
      if (!checkDependency('mini-css-extract-plugin')) {
        throw new Error(getMissingDependencyMessage('mini-css-extract-plugin'));
      }
      const MiniCssExtractPlugin = require('mini-css-extract-plugin');
      
      const defaultOptions = {
        filename: this.isDev ? '[name].css' : '[name].[contenthash:8].css',
        chunkFilename: this.isDev ? '[id].css' : '[id].[contenthash:8].css',
      };
      
      return new MiniCssExtractPlugin(Object.assign({}, defaultOptions, options));
    };
    
    // CssMinimizerWebpackPlugin
    this.pluginsRegistry.CssMinimizerWebpackPlugin = (options = {}) => {
      if (!checkDependency('css-minimizer-webpack-plugin')) {
        throw new Error(getMissingDependencyMessage('css-minimizer-webpack-plugin'));
      }
      const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
      return new CssMinimizerWebpackPlugin(options);
    };
    
    // DefinePlugin
    this.pluginsRegistry.DefinePlugin = (definitions = {}) => {
      if (!checkDependency('webpack')) {
        throw new Error(getMissingDependencyMessage('webpack'));
      }
      const webpack = require('webpack');
      
      // Get environment variables
      const getClientEnvironment = () => {
        const path = require('path');
        let packageJson;
        
        try {
          packageJson = require(path.resolve(process.cwd(), 'package.json'));
        } catch (e) {
          packageJson = { name: 'app' };
        }
        
        const appName = process.env.APP_NAME || packageJson.name;
        
        const raw = {
          NODE_ENV: process.env.NODE_ENV || 'development',
          PUBLIC_PATH: this.publicPath,
          OUTPUT_PATH: this.outputPath,
          APP_NAME: appName,
          PORT: this.port,
          QIANKUN: this.isQiankun,
          QIANKUN_SLAVE: this.isQiankunSlave,
          QIANKUN_MASTER: this.isQiankunMaster,
        };

        const stringified = {
          'process.env': Object.keys(raw).reduce((env, key) => {
            env[key] = JSON.stringify(raw[key]);
            return env;
          }, {}),
        };

        return { raw, stringified };
      };

      const env = getClientEnvironment();
      return new webpack.DefinePlugin(Object.assign({}, env.stringified, definitions));
    };
    
    // ProvidePlugin
    this.pluginsRegistry.ProvidePlugin = (definitions = {}) => {
      if (!checkDependency('webpack')) {
        throw new Error(getMissingDependencyMessage('webpack'));
      }
      const webpack = require('webpack');
      
      const defaultDefinitions = {
        process: 'process/browser',
      };
      
      return new webpack.ProvidePlugin(Object.assign({}, defaultDefinitions, definitions));
    };
    
    // NodePolyfillPlugin
    this.pluginsRegistry.NodePolyfillPlugin = (options = {}) => {
      if (!checkDependency('node-polyfill-webpack-plugin')) {
        throw new Error(getMissingDependencyMessage('node-polyfill-webpack-plugin'));
      }
      const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
      return new NodePolyfillPlugin(options);
    };
    
    // BundleAnalyzerPlugin
    this.pluginsRegistry.BundleAnalyzerPlugin = (options = {}) => {
      if (!checkDependency('webpack-bundle-analyzer')) {
        throw new Error(getMissingDependencyMessage('webpack-bundle-analyzer'));
      }
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      return new BundleAnalyzerPlugin(options);
    };
  }
  
  /**
   * 注册所有可用的加载器
   * Register all available loaders
   */
  registerLoaders() {
    // CSS Loader
    this.loadersRegistry.css = () => {
      if (!checkDependency('css-loader')) {
        throw new Error(getMissingDependencyMessage('css-loader'));
      }
      if (!checkDependency('style-loader') && this.isDev) {
        throw new Error(getMissingDependencyMessage('style-loader'));
      }
      if (!checkDependency('mini-css-extract-plugin') && !this.isDev) {
        throw new Error(getMissingDependencyMessage('mini-css-extract-plugin'));
      }
      
      const MiniCssExtractPlugin = !this.isDev ? require('mini-css-extract-plugin') : null;
      
      return {
        test: /\.css$/,
        use: [
          this.isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      };
    };
    
    // Less Loader
    this.loadersRegistry.less = () => {
      if (!checkDependency('css-loader')) {
        throw new Error(getMissingDependencyMessage('css-loader'));
      }
      if (!checkDependency('less-loader')) {
        throw new Error(getMissingDependencyMessage('less-loader'));
      }
      if (!checkDependency('less')) {
        throw new Error(getMissingDependencyMessage('less'));
      }
      if (!checkDependency('style-loader') && this.isDev) {
        throw new Error(getMissingDependencyMessage('style-loader'));
      }
      if (!checkDependency('mini-css-extract-plugin') && !this.isDev) {
        throw new Error(getMissingDependencyMessage('mini-css-extract-plugin'));
      }
      
      const MiniCssExtractPlugin = !this.isDev ? require('mini-css-extract-plugin') : null;
      
      return {
        test: /\.less$/,
        use: [
          this.isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
        ],
      };
    };
    
    // Babel Loader
    this.loadersRegistry.babel = (options = {}) => {
      if (!checkDependency('babel-loader')) {
        throw new Error(getMissingDependencyMessage('babel-loader'));
      }
      if (!checkDependency('@babel/core')) {
        throw new Error(getMissingDependencyMessage('@babel/core'));
      }
      
      const defaultOptions = {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: options,
        },
      };
      
      return defaultOptions;
    };
    
    // Asset Loader for Images
    this.loadersRegistry.images = (options = {}) => {
      if (!checkDependency('webpack')) {
        throw new Error(getMissingDependencyMessage('webpack'));
      }
      
      const defaultOptions = {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name].[hash][ext]',
        },
      };
      
      if (options.maxSize) {
        defaultOptions.parser = {
          dataUrlCondition: {
            maxSize: options.maxSize,
          },
        };
        delete options.maxSize;
      }
      
      return Object.assign({}, defaultOptions, options);
    };
    
    // Asset Loader for Fonts
    this.loadersRegistry.fonts = (options = {}) => {
      if (!checkDependency('webpack')) {
        throw new Error(getMissingDependencyMessage('webpack'));
      }
      
      const defaultOptions = {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name].[hash][ext]',
        },
      };
      
      return Object.assign({}, defaultOptions, options);
    };
  }
  
  /**
   * 向配置中添加插件
   * Add a plugin to the webpack configuration
   * @param {string} pluginName - 要添加的插件名称
   * @param {Object} options - 传递给插件的选项
   * @returns {WebpackConfigBuilder} - 返回 this 以支持链式调用
   */
  addPlugin(pluginName, options = {}) {
    this.init();
    
    if (!this.pluginsRegistry[pluginName]) {
      throw new Error(`Plugin ${pluginName} is not registered. Available plugins: ${Object.keys(this.pluginsRegistry).join(', ')}`);
    }
    
    try {
      const plugin = this.pluginsRegistry[pluginName](options);
      this.config.plugins.push(plugin);
    } catch (error) {
      console.error(`Error adding plugin ${pluginName}:`, error.message);
      throw error;
    }
    
    return this;
  }
  
  /**
   * 向配置中添加加载器
   * Add a loader to the webpack configuration
   * @param {string} loaderName - 要添加的加载器名称
   * @param {Object} options - 传递给加载器的选项
   * @returns {WebpackConfigBuilder} - 返回 this 以支持链式调用
   */
  addLoader(loaderName, options = {}) {
    this.init();
    
    if (!this.loadersRegistry[loaderName]) {
      throw new Error(`Loader ${loaderName} is not registered. Available loaders: ${Object.keys(this.loadersRegistry).join(', ')}`);
    }
    
    try {
      const loader = this.loadersRegistry[loaderName](options);
      this.config.module.rules.push(loader);
    } catch (error) {
      console.error(`Error adding loader ${loaderName}:`, error.message);
      throw error;
    }
    
    return this;
  }
  
  /**
   * 获取最终的 webpack 配置
   * Get the final webpack configuration
   * @returns {Object} - webpack 配置对象
   */
  getConfig() {
    this.init();
    return this.config;
  }
  
  /**
   * 创建包含常用插件和加载器的默认配置
   * Create a default configuration with common plugins and loaders
   * @returns {WebpackConfigBuilder} - 返回 this 以支持链式调用
   */
  createDefaultConfig() {
    this.init()
      .addPlugin('WebpackBar')                // 添加进度条插件
      .addPlugin('HtmlWebpackPlugin')         // 添加 HTML 生成插件
      .addPlugin('MiniCssExtractPlugin')      // 添加 CSS 提取插件
      .addPlugin('CssMinimizerWebpackPlugin') // 添加 CSS 压缩插件
      .addPlugin('DefinePlugin')              // 添加环境变量定义插件
      .addPlugin('ProvidePlugin')             // 添加自动加载模块插件
      .addPlugin('NodePolyfillPlugin')        // 添加 Node.js polyfill 插件
      .addLoader('css')                       // 添加 CSS 加载器
      .addLoader('less')                      // 添加 Less 加载器
      .addLoader('babel')                     // 添加 Babel 加载器
      .addLoader('images', { maxSize: 10 * 1024 }) // 添加图片加载器，10KB 以下转为 base64
      .addLoader('fonts');                    // 添加字体加载器
      
    // 如果开启了分析模式，添加打包分析插件
    if (this.isAnalyze) {
      this.addPlugin('BundleAnalyzerPlugin');
    }
    
    return this;
  }
}

// 创建并导出单例实例 (Create and export a singleton instance)
const webpackConfigBuilder = new WebpackConfigBuilder();

// 导出构建器和插件/加载器以便直接访问 (Export the builder and plugins/loaders for direct access)
export default {
  // 主构建器实例 (Main builder instance)
  configBuilder: webpackConfigBuilder,
  
  // 直接访问插件 (Direct access to plugins)
  plugins: new Proxy({}, {
    get: (target, prop) => {
      if (!webpackConfigBuilder.pluginsRegistry[prop]) {
        throw new Error(`插件 ${prop} 未注册。可用插件: ${Object.keys(webpackConfigBuilder.pluginsRegistry).join(', ')}`);
      }
      return webpackConfigBuilder.pluginsRegistry[prop]();
    }
  }),
  
  // 直接访问加载器 (Direct access to loaders)
  loaders: new Proxy({}, {
    get: (target, prop) => {
      if (!webpackConfigBuilder.loadersRegistry[prop]) {
        throw new Error(`加载器 ${prop} 未注册。可用加载器: ${Object.keys(webpackConfigBuilder.loadersRegistry).join(', ')}`);
      }
      return webpackConfigBuilder.loadersRegistry[prop]();
    }
  }),
  
  // 创建新构建器实例的工厂函数 (Factory function to create a new builder instance)
  createConfigBuilder: () => new WebpackConfigBuilder(),
  
  // 创建默认配置的辅助函数 (Helper to create a default configuration)
  createDefaultConfig: () => webpackConfigBuilder.createDefaultConfig().getConfig(),
};
