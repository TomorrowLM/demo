import viteBuilderMod from '../../npm/shared/src/build/vite/index.builder.js';
// import { createRequire } from 'node:module'
// const require = createRequire(import.meta.url)
// console.log('require:', require)
// const { buildConfig } = require('@lm/shared')
// console.log('buildConfig:', buildConfig)
// const ViteBuilder = buildConfig.viteBuilderMod

export default ({ mode }) => new viteBuilderMod().createConfig({ mode })