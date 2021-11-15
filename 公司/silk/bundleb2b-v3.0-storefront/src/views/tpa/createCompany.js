import axios from 'axios'
import * as api from '../../common/api'
import themeConfig from '../../themeConfig'
import B3Storage from '../../common/utils/B3Storage'
import { tips } from '../../common/locales'
import Alert from '../../common/utils/Alert'

export default function (companyInfo, createAccount) {
  if (createAccount) {
    return axios.post(`${themeConfig.apiBaseUrl}/api/v2/frontend/companies`, companyInfo)
      .then(response => {
        const res = response.data
        B3Storage.TPACompanyInfo.removeValue()
        if (res.code !== 200) {
          return Alert.error(tips.globalError)
        }

        const type = (res.code === 200) ? 'success' : 'error'
        let text
        let directUrl

        const autoApproval = (res.data.companyAutoApprove === '1')

        if (res.code === 200) {
          text = autoApproval ? tips.createCompanyApproved : tips.createCompanyChecking
          sessionStorage.removeItem('B3IsB2CUser')
          directUrl = '/'
        } else {
          text = res.data.message
          directUrl = '/trade-professional-application/'
        }

        return Alert[type](text, {
          allowOutsideClick: false,
          showCancelButton: false,
        }).then(() => {
          if (autoApproval) {
            B3Storage.B3IsB2CUser.removeValue()
          }
          window.location.href = directUrl
        })
      })
      .catch(() => {
        //
        window.B3spinner.hide()
      })
  }

  return api.createCompany(companyInfo).then(res => {
    const autoApproval = (res.companyAutoApprove === '1')

    const text = autoApproval ? tips.createCompanyApproved : tips.createCompanyChecking
    return Alert.success(text, {
      allowOutsideClick: false,
      showCancelButton: false,
    }).then(() => {
      if (autoApproval) {
        B3Storage.B3IsB2CUser.removeValue()
        window.location.href = '/'
        return
      }
      window.location.reload()
    })
  })
}
