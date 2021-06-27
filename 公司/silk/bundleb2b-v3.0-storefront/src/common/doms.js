import { merge } from 'lodash'

import themeConfig from '../themeConfig'

export default merge({}, themeConfig.doms, window.b3themeConfig?.doms)
