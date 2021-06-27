/**
 * @file /scripts/createWebpages.js
 * this script will be triggered by script `pub:webpages` in /package.json
 * it will auto create the webpages by the API
 */

const chalk = require('chalk')
const fetch = require('node-fetch')
const config = require('./b3config')

const main = async () => {
  const {
    storeHash,
    accessToken,
    customLayouts,
  } = config
  const {
    rootPage,
    pagePrefix,
    pages,
  } = customLayouts
  const headers = {
    'X-Auth-Client': accessToken,
    'X-Auth-Token': accessToken,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
  const url = `https://api.bigcommerce.com/stores/${storeHash}/v2/pages`
  console.log(chalk.cyan('😀 start to create pages, please wait for a while…'))

  try {
    const resp = await fetch(url, {
      method: 'post',
      headers,
      body: JSON.stringify({
        name: rootPage,
        is_visible: false,
        url: `/${rootPage}/`,
        type: 'page',
        body: '',
      }),
    })
    const { id } = await resp.json()
    console.log(chalk.green('root page has been created successfully!'))
    console.log(chalk.green('started to create pages…'))
    const requests = pages.map(pageName => fetch(url, {
      method: 'post',
      headers,
      body: JSON.stringify({
        parent_id: id,
        name: `${pagePrefix ? `${pagePrefix} ` : ''}${pageName}`,
        is_visible: true,
        url: `/${pagePrefix ? `${pagePrefix}-` : ''}${pageName.replace(/\s+/g, '-').toLowerCase()}/`,
        type: 'page',
        body: '',
        meta_title: pageName,
      }),
    }))
    try {
      await Promise.all(requests)
      console.log(chalk.green('pages has been created successfully'))
    } catch (error) {
      console.log(chalk.red('pages has been created failed'))
    }
  } catch (error) {
    console.log(chalk.red('root page has been created failed'))
  }
}

main()
