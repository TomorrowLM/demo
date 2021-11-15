// 从 customize-cra import some methods
const {
  override,
  fixBabelImports,
  addDecoratorsLegacy,
  useBabelRc
} = require('customize-cra')

const addPublicPath = () => (config) => {
  config.output.publicPath = './'
  return config
}

module.exports = override(
  fixBabelImports('import', [
    {
      libraryName: '@material-ui/core',
      libraryDirectory: 'esm', // default:lib
      camel2DashComponentName: false // default:true
    },
    {
      libraryName: '@material-ui/icons',
      libraryDirectory: 'esm',
      camel2DashComponentName: false
    }
  ]), // load on demand
  addDecoratorsLegacy(),
  addPublicPath(),
  useBabelRc() // .babelrc
)
