import React, { useState, useEffect } from 'react'
import { Stepper, Step, StepLabel, styled } from '@material-ui/core'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  updateProfileInfo,
  resetProfileInfo
} from '../../store/actions/dataSourceProfile'
import { getStaticText, snackbar } from '../../utils'
import services from '../../services'
import { Spin } from '../../components'
import {
  BasicInfo,
  SourceFileUpload,
  FileAnalysis,
  AttributeMapping,
  ProfilePreview
} from './StepComponents'

const StepContentContainer = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(2)
}))

const DataSourceProfile = ({
  profileInfo,
  updateProfileInfo,
  resetProfileInfo
}) => {
  const [activeStep, setActiveStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const stepsTitle = getStaticText('page.data.source.profile.steps.title')
  const {
    profileName,
    sourceName,
    autoAttributeMappingField,
    sourceFileType,
    fileUrl,
    attributeMapping,
    matchedAttributesNums,
    connectionId,
    connectionName,
    channelName
  } = profileInfo
  useEffect(() => {
    setIsLoading(true)
    const fetchData = async () => {
      const {
        list: [channelInfo]
      } = await services.channels.getMerchantChannelTypes()
      if (!channelInfo.id) {
        snackbar.error(getStaticText('page.channels.no.channel.id'))
        return false
      }
      const resp = await services.channels.getChannelConnections(channelInfo.id)
      updateProfileInfo({
        connectionId: resp.channelConnections[0].connectionId,
        channelName: resp.channelName,
        connectionName: resp.channelConnections[0].connectionConfigs[0].value
      })
      setIsLoading(false)
    }
    fetchData()
    return resetProfileInfo
  }, [updateProfileInfo, resetProfileInfo])
  return (
    <>
      <Stepper activeStep={activeStep} alternativeLabel>
        {stepsTitle.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <StepContentContainer>
        <div>
          {(() => {
            switch (activeStep) {
              default:
                return null
              case 0:
                return (
                  <Spin isSpinning={isLoading} tip="Loading...">
                    <BasicInfo
                      basicInfo={{
                        profileName,
                        sourceName
                      }}
                      channelName={channelName}
                      connectionName={connectionName}
                      onSubmit={(value) => updateProfileInfo(value)}
                      onReset={(value) => resetProfileInfo(value)}
                      step={{ setStep: setActiveStep, currentStep: activeStep }}
                    />
                  </Spin>
                )
              case 1:
                return (
                  <SourceFileUpload
                    sourceFileUpload={{
                      autoAttributeMappingField,
                      sourceFileType,
                      fileUrl
                    }}
                    channelName={channelName}
                    onSubmit={(value) => updateProfileInfo(value)}
                    step={{ setStep: setActiveStep, currentStep: activeStep }}
                  />
                )
              case 2:
                return (
                  <FileAnalysis
                    fileAnalysis={{
                      sourceFileType,
                      autoAttributeMappingField,
                      fileUrl,
                      connectionId
                    }}
                    onSubmit={(value) => updateProfileInfo(value)}
                    step={{ setStep: setActiveStep, currentStep: activeStep }}
                  />
                )
              case 3:
                return (
                  <AttributeMapping
                    attributeMapping={{
                      attributeMapping,
                      connectionId,
                      autoAttributeMappingField,
                      matchedAttributesNums
                    }}
                    onSubmit={(value) => updateProfileInfo(value)}
                    step={{ setStep: setActiveStep, currentStep: activeStep }}
                  />
                )
              case 4:
                return (
                  <ProfilePreview
                    profilePreview={{
                      attributeMapping,
                      profileName,
                      sourceName,
                      sourceFileType,
                      matchedAttributesNums,
                      autoAttributeMappingField,
                      connectionId,
                      channelName
                    }}
                    onSubmit={(value) => updateProfileInfo(value)}
                    step={{ setStep: setActiveStep, currentStep: activeStep }}
                  />
                )
            }
          })()}
        </div>
      </StepContentContainer>
    </>
  )
}

DataSourceProfile.propTypes = {
  profileInfo: PropTypes.shape().isRequired,
  updateProfileInfo: PropTypes.func.isRequired,
  resetProfileInfo: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  const {
    dataSourceProfile: { profileInfo }
  } = state

  return {
    profileInfo
  }
}

export default connect(mapStateToProps, {
  updateProfileInfo,
  resetProfileInfo
})(DataSourceProfile)
