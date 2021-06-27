import React, { Component } from 'react'
import PropTypes from 'prop-types'
import services from '../../services'
import { Spin } from '../../components'
import { snackbar, getStaticText } from '../../utils'

class Channels extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired
  }

  componentDidMount() {
    this.getMerchantChannelTypes()
  }

  getMerchantChannelTypes = async () => {
    const {
      list: [channelInfo]
    } = await services.channels.getMerchantChannelTypes()
    if (!channelInfo.id) {
      snackbar.error(getStaticText('page.channels.no.channel.id'))
      return false
    }
    const { history } = this.props
    history.push(`/channels/${channelInfo.id}`)
  }

  render() {
    return <Spin isStretch />
  }
}

export default Channels
