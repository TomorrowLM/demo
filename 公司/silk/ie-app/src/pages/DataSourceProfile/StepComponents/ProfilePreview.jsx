import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Paper,
  Tabs,
  Tab,
  Box,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Divider
} from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import { Enum, getStaticText } from '../../../utils'
import services from '../../../services'
import { Spin, MappingControl } from '../../../components'

const TabPanel = (props) => {
  const { children, value, index, ...other } = props
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`wrapped-tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={2} style={{ paddingTop: 0 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  )
}
TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  index: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
}

const BasicInfo = (props) => {
  const {
    profileName,
    sourceName,
    sourceFileType,
    matchedAttributesNums,
    channelName
  } = props
  const data = [
    {
      label: getStaticText('page.data.source.profile.basic.info.profile.name'),
      value: profileName
    },
    {
      label: getStaticText('page.data.source.profile.basic.info.source.name'),
      value: sourceName
    },
    {
      label: getStaticText('page.data.source.profile.basic.info.source.type'),
      value: Enum.getFileType(sourceFileType)
    },
    {
      label: getStaticText('page.data.source.profile.basic.info.ext'),
      value: channelName
    },
    {
      label: getStaticText('page.data.source.profile.preview.mapping.number'),
      value: matchedAttributesNums
    }
  ]
  return (
    <>
      <MappingControl isGroup dataSource={data} itemKey="label" />
    </>
  )
}
BasicInfo.propTypes = {
  profileName: PropTypes.string,
  sourceName: PropTypes.string,
  sourceFileType: PropTypes.number,
  matchedAttributesNums: PropTypes.number,
  channelName: PropTypes.string
}
BasicInfo.defaultProps = {
  profileName: '',
  sourceName: '',
  sourceFileType: 0,
  matchedAttributesNums: 0,
  channelName: ''
}
const AttributeMapping = (props) => {
  const { attributeMapping } = props
  const isYesOrNo = {
    0: 'No',
    1: 'Yes'
  }
  const columns = [
    {
      key: 'sourceLabel',
      title: getStaticText(
        'page.data.source.profile.attribute.mapping.source.label'
      )
    },
    {
      key: 'attributeLabel',
      title: getStaticText(
        'page.data.source.profile.attribute.mapping.attribute.label'
      )
    },
    {
      key: 'attributeCode',
      title: getStaticText(
        'page.data.source.profile.attribute.mapping.attribute.code'
      )
    },
    {
      key: 'attributeType',
      title: getStaticText(
        'page.data.source.profile.attribute.mapping.attribute.type'
      )
    },
    {
      key: 'attributeSets',
      title: getStaticText(
        'page.data.source.profile.attribute.mapping.attribute.sets'
      )
    },
    {
      key: 'filterableInCategory',
      title: getStaticText(
        'page.data.source.profile.attribute.mapping.filterable.in.category'
      ),
      render: (record) => {
        return Enum.getValue(isYesOrNo, record.filterableInCategory)
      }
    },
    {
      key: 'filterableInSearch',
      title: getStaticText(
        'page.data.source.profile.attribute.mapping.filterable.in.search'
      ),
      render: (record) => {
        return Enum.getValue(isYesOrNo, record.filterableInSearch)
      }
    },
    {
      key: 'searchable',
      title: getStaticText(
        'page.data.source.profile.attribute.mapping.searchable'
      ),
      render: (record) => {
        return Enum.getValue(isYesOrNo, record.searchable)
      }
    },
    {
      key: 'visibleInFrontend',
      title: getStaticText(
        'page.data.source.profile.attribute.mapping.visible.in.frontend'
      ),
      render: (record) => {
        return Enum.getValue(isYesOrNo, record.visibleInFrontend)
      }
    }
  ]
  return (
    <>
      <Table>
        <TableHead>
          <TableRow style={{ display: 'flex' }}>
            <TableCell align="center" style={{ flex: 2 }}>
              {getStaticText(
                'page.data.source.profile.attribute.mapping.title.source'
              )}
            </TableCell>
            <TableCell align="center" style={{ flex: 7 }}>
              {getStaticText(
                'page.data.source.profile.attribute.mapping.title.target'
              )}
            </TableCell>
          </TableRow>
        </TableHead>
      </Table>
      <TableContainer style={{ maxHeight: 660 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.key} align="center">
                  {column.title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {attributeMapping.map((row) => (
              <TableRow hover role="checkbox" key={row.sourceLabel}>
                {columns.map((column) => (
                  <TableCell key={column.key} align="center">
                    {typeof column.render === 'function'
                      ? column.render(row)
                      : row[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

AttributeMapping.propTypes = {
  attributeMapping: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

const ProfilePreview = (props) => {
  const {
    profilePreview: {
      attributeMapping,
      profileName,
      sourceName,
      sourceFileType,
      matchedAttributesNums,
      autoAttributeMappingField,
      connectionId,
      channelName
    },
    step: { setStep, currentStep }
  } = props
  const history = useHistory()
  const [value, setValue] = useState('one')
  const [isLoading, setIsLoading] = useState(false)
  const label = getStaticText('page.data.source.profile.steps.title')
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleBack = () => {
    setStep(currentStep - 1)
  }

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      const { errMsg } = await services.profile.addProfile({
        profileName,
        sourceName,
        connectionId,
        sourceFileType,
        autoAttributeMappingField,
        attributeMapping
      })
      if (!errMsg) history.push('data-source-profile/list')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Spin isSpinning={isLoading} tip="Loading...">
      <Paper square style={{ marginBottom: 20 }}>
        <Tabs
          centered
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
        >
          <Tab label={label[0]} value="one" />
          <Tab label={label[3]} value="two" />
        </Tabs>
        <Divider />
        <TabPanel value={value} index="one">
          <BasicInfo
            profileName={profileName}
            sourceName={sourceName}
            sourceFileType={sourceFileType}
            channelName={channelName}
            matchedAttributesNums={matchedAttributesNums}
            autoAttributeMappingField={autoAttributeMappingField}
          />
        </TabPanel>
        <TabPanel value={value} index="two">
          <AttributeMapping attributeMapping={attributeMapping} />
        </TabPanel>
      </Paper>
      <Button onClick={handleBack}>
        {getStaticText('page.data.source.profile.button.back')}
      </Button>
      <Button
        variant="contained"
        color="primary"
        type="text"
        onClick={handleConfirm}
      >
        {getStaticText('page.data.source.profile.button.confirm')}
      </Button>
    </Spin>
  )
}

ProfilePreview.propTypes = {
  profilePreview: PropTypes.shape({
    attributeMapping: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    profileName: PropTypes.string.isRequired,
    sourceName: PropTypes.string.isRequired,
    sourceFileType: PropTypes.number.isRequired,
    matchedAttributesNums: PropTypes.number.isRequired,
    autoAttributeMappingField: PropTypes.number.isRequired,
    connectionId: PropTypes.string.isRequired,
    channelName: PropTypes.string.isRequired
  }).isRequired,
  step: PropTypes.shape({
    setStep: PropTypes.func.isRequired,
    currentStep: PropTypes.number.isRequired
  }).isRequired
}

export default ProfilePreview
