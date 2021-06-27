import React from 'react'
import { useHistory } from 'react-router-dom'
import { Link, styled } from '@material-ui/core'
import { DataTable } from '../../components'
import { getStaticText, getFormatTime } from '../../utils'
import services from '../../services'

const StyledLink = styled(Link)({
  cursor: 'pointer'
})

const Product = () => {
  const history = useHistory()
  return (
    <>
      <DataTable
        columns={[
          {
            key: 'productId',
            title: getStaticText('page.product.list.table.title.id'),
            render(record) {
              return (
                <StyledLink
                  onClick={() => {
                    history.push(`/products/${record.productId}`)
                  }}
                >
                  {record.productId}
                </StyledLink>
              )
            }
          },
          {
            key: 'sku',
            title: getStaticText('page.product.list.table.title.sku')
          },
          {
            key: 'createdAt',
            title: getStaticText('page.product.list.table.title.created'),
            align: 'center',
            render(record) {
              return getFormatTime(record.createdAt)
            }
          },
          {
            key: 'updatedAt',
            title: getStaticText('page.product.list.table.title.updated'),
            align: 'center',
            render(record) {
              return getFormatTime(record.updatedAt)
            }
          },
          {
            key: 'lastUpdatedFile',
            title: getStaticText(
              'page.product.list.table.title.lastupdatedbyfile'
            ),
            align: 'center'
          }
        ]}
        dataService={{
          fetch: services.product.getProducts,
          params: {},
          key: 'productId'
        }}
        searchPlaceholder={getStaticText(
          'page.product.list.search.placeholder'
        )}
      />
    </>
  )
}

export default Product
