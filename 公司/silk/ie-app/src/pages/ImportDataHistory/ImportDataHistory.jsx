import React from 'react'
import { Link, MenuItem } from '@material-ui/core'
import { DataTable, Tag } from '../../components'
import { getStaticText, getFormatTime } from '../../utils'
import { re } from '../../constants'
import services from '../../services'

const statusTagColors = {
  '0': 'greyLight',
  '1': 'success',
  '2': 'info'
}

const ImportDataHistory = () => {
  return (
    <>
      <DataTable
        searchable={false}
        columns={[
          {
            key: 'logId',
            title: getStaticText('page.file.upload.list.table.title.id')
          },
          {
            key: 'filename',
            title: getStaticText('page.file.upload.list.table.title.file.name')
          },
          {
            key: 'profileName',
            title: getStaticText(
              'page.data.source.profile.basic.info.profile.name'
            )
          },
          {
            key: 'status',
            title: getStaticText('page.file.upload.list.table.title.status'),
            align: 'center',
            render(record) {
              return (
                <Tag color={statusTagColors[record.status]}>
                  {getStaticText('page.file.upload.list.status')[record.status]}
                </Tag>
              )
            }
          },
          {
            key: 'created',
            title: getStaticText('page.file.upload.list.table.title.created'),
            render(record) {
              return getFormatTime(record.createdAt)
            }
          },
          {
            key: 'lastAttempt',
            title: getStaticText(
              'page.file.upload.list.table.title.last.attempt'
            ),
            render(record) {
              return getFormatTime(record.lastAttempt)
            }
          },
          {
            key: 'attempts',
            title: getStaticText('page.file.upload.list.table.title.attempts')
          },
          {
            key: 'errorReport',
            title: getStaticText(
              'page.file.upload.list.table.title.error.report'
            ),
            render(record) {
              if (!re.url.test(record.errorReport)) {
                return record.errorReport
              }
              return (
                <>
                  <MenuItem>
                    <Link href={record.errorReport} target="_blank">
                      {getStaticText(
                        'page.file.upload.list.action.button.download'
                      )}
                    </Link>
                  </MenuItem>
                </>
              )
            }
          }
        ]}
        dataService={{
          fetch: services.logs.getUploadFileList,
          key: 'logId',
          params: {
            flag: 5
          }
        }}
      />
    </>
  )
}

export default ImportDataHistory
