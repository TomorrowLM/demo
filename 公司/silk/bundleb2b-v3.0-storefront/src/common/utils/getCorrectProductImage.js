const searchImgSize = '250x100'

const getCorrectProductImage = (product, imageKey) => {
  const url = 'https://cdn11.bigcommerce.com/r-2167cb9b67fe03e6172b5954b22b4d9e3114c573/app/assets/img/ProductDefault.gif'
  product.image = product.image || { data: url }
  product.image.data = product.image.data.replace('{:size}', searchImgSize)

  if (imageKey && !product[imageKey]) product[imageKey] = url

  return product
}

export default getCorrectProductImage

export const getCorrectProductImages = (data, imageKey) => data.map(product => getCorrectProductImage(product, imageKey))
