import constants from '@/commons/constants'
import request from '@/commons/requestForAdmin'

// 
// 这两个数据需要同步
let Products: any[] | undefined 
let ProductsMap: any
function cacheProducts(products: any[]) {
  Products = products
  ProductsMap = {}
  Products.forEach((item: any) => {
    ProductsMap[item.productLineId] = item
  }) 
}
function clearProducts() {
  Products = undefined
  ProductsMap = undefined
}

// bizLine/getList
export default {
  getProducts(query?: any) {
    if (Products) return Promise.resolve(Products)  
    // 这里取所有的数据，由于数据量的原因不需要分页
    query = query || { pageNumber: 1, pageSize: 100 }
    // return Promise.resolve(require('./mock-api/product.getList.json')).then((rows: any) => {
    return request({
      url: `${constants.API_ORIGIN}/productLine/getList`, 
      data: query
    }).then(({ rows }: any) => {
      cacheProducts(rows)
      return rows
    })
  },
  getProductName(productLineId: string) {
    if (!ProductsMap) return ''
    const item = ProductsMap[productLineId]
    if (!item) return ''
    return item.productLineName
  },
  updateProduct(data: any) {
    return request({
      url: `${constants.API_ORIGIN}/productLine/updateProductLine`,
      data
    }).then((data: any) => {
      clearProducts()
      return data
    })
  },
  addProduct(data: any) {
    return request({
      url: `${constants.API_ORIGIN}/productLine/addProductLine`,
      data
    }).then((data: any) => {
      clearProducts()
      return data
    })
  }
}