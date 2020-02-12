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
    ProductsMap[item.proBizLineId] = item
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
    return Promise.resolve(require('./mock-api/product.getList.json')).then((rows: any) => {
    // return http.post(`${constants.API_ORIGIN}/proBizLine/getList`, json2form(query)).then(({ rows }: any) => {
      cacheProducts(rows)
      return rows
    })
  },
  getProductName(productId: string) {
    if (!ProductsMap) return ''
    const item = ProductsMap[productId]
    if (!item) return ''
    return item.proBizLineName
  },
  updateProduct(data: any) {
    return request({
      url: `${constants.API_ORIGIN}/proBizLine/updateProBizLineRule`,
      data
    }).then((data: any) => {
      clearProducts()
      return data
    })
  },
  addProduct(data: any) {
    return request({
      url: `${constants.API_ORIGIN}/proBizLine/addProBizLineRule`,
      data
    }).then((data: any) => {
      clearProducts()
      return data
    })
  }
}