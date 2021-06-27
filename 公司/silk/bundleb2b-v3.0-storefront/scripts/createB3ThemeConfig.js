/**
 * @file /scripts/createB3ThemeConfig.js
 * this script will be triggered by script `pub:themeConfig` in /package.json
 * it will auto push content of /b3themeConfig.js to BigCommence script manager by the API
 * you can also copy the content to script manager manually
 * the name of the script in script manager is `B3ThemeConfig`
 */

const fs = require('fs')
const fetch = require('node-fetch')
const chalk = require('chalk')
const b3themeConfig = fs.readFileSync('b3themeConfig.js')
const config = require('./b3config')

const baseUrl = `https://api.bigcommerce.com/stores/${config.storeHash}/v3/content/scripts`

const body = {
  'name': 'B3ThemeConfig',
  'description': 'test',
  'html': `<script>${b3themeConfig.toString()}</script>`,
  'load_method': 'default',
  'location': 'footer',
  'visibility': 'all_pages',
  'kind': 'script_tag',
  'consent_category': 'essential'
}

const headers = {
  'X-Auth-Client': config.accessToken,
  'X-Auth-Token': config.accessToken,
  'Accept': 'application/json',
  'Content-Type': 'application/json',
}

const getB3ThemeConfigUUID = async () => {
  try {
    const resp = await fetch(baseUrl, {
      method: 'get',
      headers,
    })
    const { data } = await resp.json()
    const B3ThemeConfig = data.filter((script) => script.name === 'B3ThemeConfig')
    if(B3ThemeConfig.length) {
      console.log(chalk.green('There is a B3 theme config, will update the config'))
      return B3ThemeConfig[0].uuid
    }
    console.log(chalk.green('There is not a B3 theme config, will create it'))
    return null
  } catch (error) {
    console.log(chalk.red(error))
    return null
  }
}

const createScript = async () => {
  try {
    console.log(chalk.green('start to create the script'))
    await fetch(baseUrl, {
      method: 'post',
      headers,
      body: JSON.stringify(body)
    })
    console.log(chalk.green('create the script successfully'))
  } catch (error) {
    console.log(chalk.red(error))
  }
}

const updateScript = async (uuid) => {
  try {
    console.log(chalk.green('start to update the script'))
    await fetch(`${baseUrl}/${uuid}`, {
      method: 'put',
      headers,
      body: JSON.stringify(body)
    })
    console.log(chalk.green('update the script successfully'))
  } catch (error) {
    console.log(chalk.red(error))
  }
}

const main = async () => {
  const uuid = await getB3ThemeConfigUUID()
  if(uuid) {
    updateScript(uuid)
  } else {
    createScript()
  }
}

main()
