import { merge } from 'lodash'

import themeConfig from '../themeConfig'

export default merge({}, themeConfig.text, window.b3themeConfig?.useText)
