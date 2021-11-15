import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  styled,
  TextField,
  MenuItem,
  Link,
  makeStyles,
  Button,
  Tooltip
} from '@material-ui/core'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import { DropzoneArea } from 'material-ui-dropzone'
import { getStaticText, Enum } from '../../../utils'
import services from '../../../services'
import { Spin, MappingControl } from '../../../components'
import {
  fileTypeList,
  autoAttributeMappingFieldList
} from '../../../utils/Enum'

const useStyles = makeStyles({
  container: {
    width: 600
  },
  previewChip: {
    minWidth: 160,
    maxWidth: 210
  }
})

const FormItem = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(1.5)
}))

const SourceFileUpload = (props) => {
  const classes = useStyles()
  const { StaticText } = React
  const {
    sourceFileUpload: { autoAttributeMappingField, sourceFileType },
    channelName,
    onSubmit,
    step: { setStep, currentStep }
  } = props

  const { getKey } = Enum
  const fields = Object.keys(autoAttributeMappingFieldList)
  const types = Object.keys(fileTypeList)
  const [isFileUpload, setIsFileUpload] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState(null)
  const handleChangeField = (e) => {
    const autoAttributeMappingField = Number(
      getKey(autoAttributeMappingFieldList, e.target.value)
    )
    onSubmit({ autoAttributeMappingField })
  }
  const handleChangeType = (e) => {
    const sourceFileType = Number(getKey(fileTypeList, e.target.value))
    onSubmit({ sourceFileType })
  }
  const handleBack = () => {
    setStep(currentStep - 1)
  }
  const handleUpload = async () => {
    setIsLoading(true)
    const data = new FormData()
    data.append('file', file)
    const resp = await services.files.filesUpload(data)
    const { fileUrl } = resp
    onSubmit({ fileUrl })
    setStep(currentStep + 1)
  }
  return (
    <Spin isSpinning={isLoading} tip="Loading...">
      <MappingControl
        dataSource={{
          label: getStaticText('page.data.source.profile.basic.info.ext'),
          value: channelName
        }}
      />
      <FormItem>
        <TextField
          style={{ minWidth: 400 }}
          select
          value={Enum.getAutoAttributeMappingField(autoAttributeMappingField)}
          onChange={handleChangeField}
          label={getStaticText(
            'page.data.source.profile.field.mapping.dropdown.label'
          )}
        >
          {fields.map((field) => (
            <MenuItem
              key={field}
              value={Enum.getAutoAttributeMappingField(field)}
            >
              {Enum.getAutoAttributeMappingField(field)}
            </MenuItem>
          ))}
        </TextField>
        <Tooltip
          title={getStaticText(
            'page.data.source.profile.source.file.upload.tooltip'
          )}
        >
          <HelpOutlineIcon style={{ marginTop: 20, marginLeft: 5 }} />
        </Tooltip>
      </FormItem>
      <FormItem>
        <TextField
          style={{ minWidth: 400 }}
          select
          value={Enum.getFileType(sourceFileType)}
          onChange={handleChangeType}
          size="small"
          label={getStaticText('page.data.source.profile.filetype.label')}
        >
          {types.map((type) => (
            <MenuItem key={type} value={Enum.getFileType(type)}>
              {Enum.getFileType(type)}
            </MenuItem>
          ))}
        </TextField>
      </FormItem>
      <FormItem>
        <Link href={Enum.getFileTypeDownloadLinks(sourceFileType)}>
          <StaticText langKey="page.data.source.profile.template.download.link.text" />
        </Link>
      </FormItem>
      <MappingControl
        dataSource={{
          label: getStaticText('page.data.source.profile.text.note'),
          value: getStaticText('page.data.source.profile.text.note.content')
        }}
      />
      <DropzoneArea
        showPreviews
        showPreviewsInDropzone={false}
        useChipsForPreview
        previewGridProps={{ container: { spacing: 1, direction: 'row' } }}
        previewChipProps={{ classes: { root: classes.previewChip } }}
        previewText="Selected files"
        maxFileSize={1024 * 1024 * 20}
        filesLimit={1}
        acceptedFiles={['.xlsx', '.csv', '.xls']}
        onChange={(files) => {
          if (!files.length) {
            setIsFileUpload(true)
            return
          }
          setFile(files[0])
          setIsFileUpload(false)
        }}
        dropzoneClass={classes.container}
      />
      <FormItem>
        <Button onClick={handleBack}>
          {getStaticText('page.data.source.profile.button.back')}
        </Button>
        <Button
          variant="contained"
          color="primary"
          type="text"
          disabled={isFileUpload}
          onClick={handleUpload}
        >
          {getStaticText('page.data.source.profile.button.upload')}
        </Button>
      </FormItem>
    </Spin>
  )
}

SourceFileUpload.propTypes = {
  sourceFileUpload: PropTypes.shape({
    autoAttributeMappingField: PropTypes.number.isRequired,
    sourceFileType: PropTypes.number.isRequired,
    fileUrl: PropTypes.string.isRequired
  }).isRequired,
  channelName: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  step: PropTypes.shape({
    setStep: PropTypes.func.isRequired,
    currentStep: PropTypes.number.isRequired
  }).isRequired
}

export default SourceFileUpload
