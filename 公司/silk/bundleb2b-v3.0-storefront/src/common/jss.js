import jss from 'jss'
import preset from 'jss-preset-default'

import themeConfig from '../themeConfig'

jss.setup(preset())
jss.setup({
  id: {
    minify: true,
  },
})

const { classes } = jss.createStyleSheet(themeConfig.styles).attach()

export default classes
