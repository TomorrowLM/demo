import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Spin, MappingControl } from '../../components'
import services from '../../services'

export default function ProductDetail() {
  const [productDetail, setProductDetail] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  const { id } = useParams()

  useEffect(() => {
    const fetchProductDetail = async () => {
      const productDetailInfo = await services.product.getProduct(id)
      setProductDetail(productDetailInfo)
      setIsLoading(false)
    }
    if (id) {
      fetchProductDetail()
    }
  }, [id])

  const dataSource = Object.entries(productDetail).reduce(
    (result, currentItem) => {
      const [label, value] = currentItem
      result.push({ label, value })
      return result
    },
    []
  )
  return (
    <Spin isSpinning={isLoading} tip="Loading...">
      <MappingControl isGroup itemKey="label" dataSource={dataSource} />
    </Spin>
  )
}
