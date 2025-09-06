/**
 * @lm/shared webpack 配置构建器
 * 此模块提供了一个可配置的 webpack 设置，允许用户按需导入和使用特定的插件和加载器。
 */

// 环境检测
const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
const isBuildTime = typeof __webpack_require__ === 'undefined';

/**
 * 安全的 require 函数，在非 Node.js 环境中返回 null
 */
function safeRequire(moduleName) {
  if (!isNode || isBuildTime) {
    return null;
  }
  try {
    return require(moduleName);
  } catch (e) {
    return null;
  }
}

/**
 * 检查依赖是否已安装且可用
 */
function checkDependency(packageName) {
  if (!isNode || isBuildTime) {
    return false;
  }
  try {
    require.resolve(packageName);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * 获取缺失依赖的友好错误消息
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
 */
class WebpackConfigBuilder {
  constructor() {
    this.config = {};
    this.initialized = false;
    
    // 只在 Node.js 环境中初始化环境变量
    if (isNode && !isBuildTime) {
      this.initEnvironment();
    }
    
    this.pluginsRegistry = {};
    this.loadersRegistry = {};
    
    // 延迟注册，避免构建时的依赖问题
    if (isNode && !isBuildTime) {
      this.registerPlugins();
      this.registerLoaders();
    }
  }
  
  initEnvironment() {
    this.isDev = process.env.NODE_ENV === 'development';
    this.isProd = process.env.NODE_ENV === 'production';
    this.isAnalyze = process.env.ANALYZE === 'true';
    this.isQiankun = process.env.QIANKUN === 'true';
    this.isQiankunSlave = process.env.QIANKUN_SLAVE === 'true';
    this.isQiankunMaster = process.env.QIANKUN_MASTER === 'true';
    this.publicPath = process.env.PUBLIC_PATH || '/';
    this.outputPath = process.env.OUTPUT_PATH || 'dist';
    this.port = process.env.PORT || 8000;
  }
  
  init() {
    if (this.initialized) return this;
    
    if (!isNode || isBuildTime) {
      console.warn('WebpackConfigBuilder: Not in Node.js environment, returning empty config');
      this.config = {};
      this.initialized = true;
      return this;
    }
    
    if (!checkDependency('webpack')) {
      throw new Error(getMissingDependencyMessage('webpack'));
    }
    
    const path = safeRequire('path');
    const webpack = safeRequire('webpack');
    
    if (!path || !webpack) {
      throw new Error('Failed to load required Node.js modules');
    }
    
    let packageJson;
    try {
      packageJson = safeRequire(path.resolve(process.cwd(), 'package.json')) || { name: 'app' };
    } catch (e) {
      packageJson = { name: 'app' };
    }
    
    const appName = process.env.APP_NAME || packageJson.name;
    
    // 创建基础配置
    this.config = {
      mode: this.isDev ? 'development' : 'production',
      entry: './src/index',
      output: {
        path: path.resolve(process.cwd(), this.outputPath),
        publicPath: this.publicPath,
        filename: this.isDev ? '[name].js' : '[name].[contenthash:8].js',
        chunkFilename: this.isDev ? '[name].chunk.js' : '[name].[contenthash:8].chunk.js',
        assetModuleFilename: 'assets/[name].[hash][ext]',
        clean: true,
      },
      devtool: this.isDev ? 'cheap-module-source-map' : false,
      devServer: {
        port: this.port,
        hot: true,
        historyApiFallback: true,
        compress: true,
        client: {
          overlay: {
            errors: true,
            warnings: false,
          },
        },
      },
      plugins: [],
      resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        alias: {
          '@': path.resolve(process.cwd(), 'src'),
        },
        fallback: {
          fs: false,
          path: false,
          crypto: false,
        },
      },
      module: {
        rules: [],
      },
    };
    
    this.initialized = true;
    return this;
  }
  
  registerPlugins() {
    // 只在运行时注册插件
    if (!isNode || isBuildTime) return;
    
    // WebpackBar plugin
    this.pluginsRegistry.WebpackBar = () => {
      if (!checkDependency('webpackbar')) {
        throw new Error(getMissingDependencyMessage('webpackbar'));
      }
      const WebpackBar = safeRequire('webpackbar');
      return WebpackBar ? new WebpackBar() : null;
    };
    
    // 其他插件注册...
    // 为了简化，这里只展示关键部分
  }
  
  registerLoaders() {
    // 只在运行时注册加载器
    if (!isNode || isBuildTime) return;
    
    // CSS Loader
    this.loadersRegistry.css = () => {
      if (!checkDependency('css-loader')) {
        throw new Error(getMissingDependencyMessage('css-loader'));
      }
      
      const MiniCssExtractPlugin = !this.isDev ? safeRequire('mini-css-extract-plugin') : null;
      
      return {
        test: /\.css$/,
        use: [
          this.isDev ? 'style-loader' : (MiniCssExtractPlugin ? MiniCssExtractPlugin.loader : 'style-loader'),
          'css-loader',
        ],
      };
    };
    
    // 其他加载器注册...
  }
  
  addPlugin(pluginName, options = {}) {
    if (!isNode || isBuildTime) {
      console.warn(`WebpackConfigBuilder: Cannot add plugin ${pluginName} in build environment`);
      return this;
    }
    
    this.init();
    
    if (!this.pluginsRegistry[pluginName]) {
      throw new Error(`Plugin ${pluginName} is not registered`);
    }
    
    try {
      const plugin = this.pluginsRegistry[pluginName](options);
      if (plugin) {
        this.config.plugins.push(plugin);
      }
    } catch (error) {
      console.error(`Error adding plugin ${pluginName}:`, error.message);
      throw error;
    }
    
    return this;
  }
  
  addLoader(loaderName, options = {}) {
    if (!isNode || isBuildTime) {
      console.warn(`WebpackConfigBuilder: Cannot add loader ${loaderName} in build environment`);
      return this;
    }
    
    this.init();
    
    if (!this.loadersRegistry[loaderName]) {
      throw new Error(`Loader ${loaderName} is not registered`);
    }
    
    try {
      const loader = this.loadersRegistry[loaderName](options);
      if (loader) {
        this.config.module.rules.push(loader);
      }
    } catch (error) {
      console.error(`Error adding loader ${loaderName}:`, error.message);
      throw error;
    }
    
    return this;
  }
  
  getConfig() {
    if (!isNode || isBuildTime) {
      console.warn('WebpackConfigBuilder: Returning empty config in build environment');
      return {};
    }
    
    this.init();
    return this.config;
  }
  
  createDefaultConfig() {
    if (!isNode || isBuildTime) {
      console.warn('WebpackConfigBuilder: Cannot create default config in build environment');
      return this;
    }
    
    this.init()
      .addPlugin('WebpackBar')
      .addPlugin('HtmlWebpackPlugin')
      .addLoader('css')
      .addLoader('babel');
      
    return this;
  }
}

// 创建并导出单例实例
const webpackConfigBuilder = new WebpackConfigBuilder();

// 导出构建器
const webpackConfig = {
  configBuilder: webpackConfigBuilder,
  createConfigBuilder: () => new WebpackConfigBuilder(),
  createDefaultConfig: () => {
    if (!isNode || isBuildTime) {
      return {};
    }
    return webpackConfigBuilder.createDefaultConfig().getConfig();
  },
};

// 只使用 CommonJS 导出，移除 ES 模块导出
module.exports = webpackConfig;
