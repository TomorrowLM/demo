import React from 'react'
import { useHistory } from 'react-router-dom'
import { IconButton, styled } from '@material-ui/core'
import { ArrowBack } from '@material-ui/icons'

const StyledButton = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing()
}))

const BackButton = (props) => {
  const history = useHistory()
  const handleBack = () => {
    history.goBack()
  }
  return (
    <StyledButton onClick={handleBack} {...props}>
      <ArrowBack />
    </StyledButton>
  )
}

export default BackButton
