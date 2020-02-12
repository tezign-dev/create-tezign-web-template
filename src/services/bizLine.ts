import request from '@/commons/requestForAdmin'
import constants from '@/commons/constants'

// 这两个数据需要同步
let BizLines: any[] | undefined
let BizLinesMap: any
function cacheBizLines(bizLines: any[]) {
  BizLines = bizLines
  BizLinesMap = {}
  BizLines.forEach((item: any) => {
    BizLinesMap[item.bizLineId] = item
  }) 
}
function clearBizLines() {
  BizLines = undefined
  BizLinesMap = undefined
}

// bizLine/getList
export default {
  getBizLines(query?: any) {
    if (BizLines) return Promise.resolve(BizLines)  
    // 这里取所有的数据，由于数据量的原因不需要分页
    query = query || { pageNumber: 1, pageSize: 100 }
    // return Promise.resolve(require('./mock-api/bizLine.getList.json')).then((rows: any) => {
    return request({
      url: `${constants.API_ORIGIN}/bizLine/getList`,
      data: query
    }).then(({ rows }: any) => {
      cacheBizLines(rows)
      return rows
    })
  },
  getBizLineName(id: string) {
    if (!BizLinesMap) return ''
    const item = BizLinesMap[id]
    if (!item) return ''
    return item.bizLineName 
  },
  updateBizLine(data: any) {
    return request({
      url: `${constants.API_ORIGIN}/bizLine/updateBizLineRule`,
      data
    }).then((data: any) => {
      clearBizLines()
      return data
    })
  },
  addBizLine(data: any) {
    return request({
      url: `${constants.API_ORIGIN}/bizLine/addBizLineRule`,
      data
    }).then((data: any) => {
      clearBizLines()
      return data
    })
  }
}