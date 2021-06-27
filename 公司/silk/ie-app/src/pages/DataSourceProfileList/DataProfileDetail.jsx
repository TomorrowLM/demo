import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Table,
  styled,
  Typography
} from '@material-ui/core'
import { getStaticText, Enum } from '../../utils'
import services from '../../services'
import { Spin, MappingControl } from '../../components'

const TableRoot = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.common.white
}))

const PageTitle = styled(Typography)(({ theme }) => ({
  padding: `${theme.spacing()}px 0`
}))

const BasicInfoContainer = styled(TableRoot)(({ theme }) => ({
  padding: `${theme.spacing(0.5)}px ${theme.spacing(2)}px`
}))

const DataProfileDetail = (props) => {
  const {
    match: {
      params: { id }
    }
  } = props

  const [isLoading, setIsLoading] = useState(false)
  const [attributeMapping, setAttributeMapping] = useState([])
  const [basicInfo, setBasicInfo] = useState({
    profileName: '',
    sourceName: '',
    sourceType: 0,
    channelName: '',
    connectionName: ''
  })

  useEffect(() => {
    setIsLoading(true)
    const fetchData = async () => {
      try {
        const resp = await services.profile.getProfileById(id)
        setAttributeMapping(resp.attributeMapping)
        setBasicInfo({
          profileName: resp.profileName,
          sourceName: resp.sourceName,
          sourceType: resp.sourceType,
          channelName: resp.targetChannelConnection.channelName,
          connectionName: resp.targetChannelConnection.connectionName
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [id])
  const columns = [
    {
      key: 'index',
      title: getStaticText('page.product.list.table.title.id')
    },
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
    }
  ]
  const basicInfoDataSource = [
    {
      label: getStaticText('page.data.source.profile.basic.info.profile.name'),
      value: basicInfo.profileName
    },
    {
      label: getStaticText('page.data.source.profile.basic.info.source.name'),
      value: basicInfo.sourceName
    },
    {
      label: getStaticText('page.data.source.profile.basic.info.source.type'),
      value: Enum.getFileType(basicInfo.sourceType)
    },
    {
      label: getStaticText('page.data.source.profile.basic.info.ext'),
      value: `${basicInfo.channelName} - ${basicInfo.connectionName}`
    }
  ]
  return (
    <Spin isSpinning={isLoading} tip="Loading...">
      <PageTitle variant="h6">
        {getStaticText(
          'page.data.source.profile.steps.title.general.information'
        )}
      </PageTitle>
      <BasicInfoContainer>
        <MappingControl
          isGroup
          itemKey="label"
          itemSpan={{
            md: 6,
            xs: 12,
            lg: 3
          }}
          dataSource={basicInfoDataSource}
        />
      </BasicInfoContainer>
      <PageTitle variant="h6">
        {getStaticText('page.data.source.profile.steps.title')[3]}
      </PageTitle>
      <TableRoot>
        <Table>
          <TableHead>
            <TableRow style={{ display: 'flex' }}>
              <TableCell align="center" style={{ flex: 1 }}>
                {getStaticText(
                  'page.data.source.profile.attribute.mapping.title.source'
                )}
              </TableCell>
              <TableCell align="center" style={{ flex: 4 }}>
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
                <TableRow key={row.index}>
                  {columns.map((column) => (
                    <TableCell key={column.key} align="center">
                      {row[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TableRoot>
    </Spin>
  )
}
DataProfileDetail.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
}
export default DataProfileDetail
