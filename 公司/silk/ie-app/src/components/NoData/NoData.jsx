import React from 'react'
import { DataUsageRounded } from '@material-ui/icons'
import { styled, Typography } from '@material-ui/core'
import PropsTypes from 'prop-types'

const Container = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100%',
  padding: theme.spacing(),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  color: theme.palette.grey[500]
}))

const NoData = ({ text }) => {
  return (
    <Container>
      <DataUsageRounded fontSize="large" />
      <Typography>{text}</Typography>
    </Container>
  )
}

NoData.propTypes = {
  text: PropsTypes.string
}

NoData.defaultProps = {
  text: 'No Data'
}

export default NoData
