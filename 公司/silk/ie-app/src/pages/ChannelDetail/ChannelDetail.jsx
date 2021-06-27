import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { styled } from '@material-ui/core'
import services from '../../services'
import { Spin, MappingControl } from '../../components'

const LogoContainer = styled('div')({
  maxWidth: 500,
  '& img': {
    maxWidth: '100%'
  }
})

class Channels extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        channelId: PropTypes.string
      })
    }).isRequired
  }

  constructor() {
    super()
    this.state = {
      channelName: '',
      channelLogo: '',
      channelConnections: [],
      isLoading: true
    }
  }

  componentDidMount() {
    this.getChannelConnections()
  }

  getChannelConnections = async () => {
    const {
      match: {
        params: { channelId }
      }
    } = this.props
    const resp = await services.channels.getChannelConnections(channelId)
    this.setState({
      ...resp,
      isLoading: false
    })
  }

  render() {
    const {
      isLoading,
      channelLogo,
      channelName,
      channelConnections
    } = this.state
    return (
      <>
        <LogoContainer>
          <img src={channelLogo} alt={channelName} />
        </LogoContainer>
        {channelConnections.map((connection) => (
          <MappingControl
            isGroup
            dataSource={connection.connectionConfigs}
            key={connection.connectionId}
            itemKey="field"
          />
        ))}
        {isLoading && <Spin isStretch />}
      </>
    )
  }
}

export default Channels
