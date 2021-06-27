import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Paper, Typography, Button, styled } from '@material-ui/core'
import services from '../../../services'
import { Enum, getStaticText } from '../../../utils'
import { Spin, MappingControl } from '../../../components'

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2)
}))

const FileAnalysis = (props) => {
  const { StaticText } = React
  const {
    fileAnalysis: {
      sourceFileType,
      autoAttributeMappingField,
      fileUrl,
      connectionId
    },
    onSubmit,
    step: { setStep, currentStep }
  } = props

  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState({
    attributes: 0,
    matchedAttributes: {
      matchedAttributesNums: 0
    }
  })
  useEffect(() => {
    setIsLoading(true)
    const fetchData = async () => {
      const res = await services.files.fileAnalysis({
        flag: 'profile',
        fileUrl,
        connectionId,
        autoAttributeMappingField,
        sourceFileType
      })
      if (res.errMsg) {
        setStep(currentStep - 1)
      } else {
        setData(res)
        setIsLoading(false)
      }
    }
    fetchData()
  }, [
    fileUrl,
    autoAttributeMappingField,
    sourceFileType,
    connectionId,
    setStep,
    currentStep
  ])

  const handleBack = () => {
    setStep(currentStep - 1)
  }

  const handleNext = () => {
    onSubmit({
      matchedAttributesNums: data.matchedAttributes.matchedAttributesNums,
      attributeMapping: data.matchedAttributes.matchedAttributesItems.concat(
        data.unmatchedAttributes.unmatchedAttributesItems
      )
    })
    setStep(currentStep + 1)
  }

  return (
    <Spin isSpinning={isLoading} tip="Loading...">
      <StyledPaper>
        <MappingControl
          isGroup
          dataSource={[
            {
              label: getStaticText('page.data.source.profile.filetype.label'),
              value: Enum.getFileType(sourceFileType)
            },
            {
              label: getStaticText(
                'page.data.source.profile.file.analysis.attribute.number'
              ),
              value: data.attributes
            },
            {
              label: getStaticText(
                'page.data.source.profile.file.analysis.attribute.mapping'
              ),
              value: Enum.getAutoAttributeMappingField(
                autoAttributeMappingField
              )
            },
            {
              label: getStaticText(
                'page.data.source.profile.file.analysis.matched.attribute'
              ),
              value: data.matchedAttributes?.matchedAttributesNums
            }
          ]}
          itemKey="label"
        />
        <MappingControl
          dataSource={{
            label: getStaticText(
              'page.data.source.profile.file.analysis.note.title'
            ),
            value: ''
          }}
        />
        <Typography>
          <StaticText langKey="page.data.source.profile.file.analysis.note.first.half" />
          <span style={{ fontWeight: 900 }}>
            {data.attributes - data.matchedAttributes?.matchedAttributesNums}
          </span>

          <StaticText langKey="page.data.source.profile.file.analysis.note.second.half" />
          <span style={{ fontWeight: 900 }}>
            {getStaticText(
              'page.data.source.profile.file.analysis.download.tips'
            )}
          </span>
          <StaticText langKey="page.data.source.profile.file.analysis.note.last.half" />
        </Typography>
        <Button
          style={{ marginTop: 10 }}
          variant="contained"
          color="primary"
          type="text"
          href={data.suggestionFileUrl}
        >
          {getStaticText('page.data.source.profile.button.download')}
        </Button>
      </StyledPaper>
      <Button onClick={handleBack}>
        {getStaticText('page.data.source.profile.button.back')}
      </Button>
      <Button
        variant="contained"
        color="primary"
        type="text"
        onClick={handleNext}
      >
        {getStaticText('page.data.source.profile.button.next')}
      </Button>
    </Spin>
  )
}

FileAnalysis.propTypes = {
  fileAnalysis: PropTypes.shape({
    atrributeMapping: PropTypes.shape({}),
    sourceFileType: PropTypes.number.isRequired,
    autoAttributeMappingField: PropTypes.number.isRequired,
    fileUrl: PropTypes.string.isRequired,
    connectionId: PropTypes.string.isRequired
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  step: PropTypes.shape({
    setStep: PropTypes.func.isRequired,
    currentStep: PropTypes.number.isRequired
  }).isRequired
}

export default FileAnalysis
