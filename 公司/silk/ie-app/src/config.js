import { createMuiTheme } from '@material-ui/core/styles'

export const storageSchema = [
  {
    key: 'lang',
    valueType: 'String',
    storageType: 'local'
  },
  {
    key: 'userInfo',
    valueType: 'Object',
    storageType: 'local'
  }
]

export const theme = createMuiTheme({
  typography: {
    fontSize: 12
  }
})
