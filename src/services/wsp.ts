import fetch from 'isomorphic-fetch'
import merge from 'lodash/merge'
import pickBy from 'lodash/pickBy'
import identity from 'lodash/identity'
import constants from '@/commons/constants'

const defaults = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=UTF-8'
  }
}

export function config(options: any) {
  merge(defaults, options)
}

function request (options: any) {
  const { method, url, data } = options
  return fetch(url, merge({}, defaults, {
    method,
    body: JSON.stringify(pickBy(data, identity)),
  })).then((res: any) => {
    const { status } = res
    if (status !== 200) return Promise.reject({ code: status, message: '服务端异常' })
    return res.json().then((res: any) => {
      const { code, msg, data } = res
      if (code !== 200) return Promise.reject({ code, message: msg })
      return data
    }, () => {
      return Promise.reject({ code: 'DATA-ERROR', message: '服务端异常' })
    })
  })
}

const API_ORIGIN = 'https://test-track-api.tezign.com'

export default {
  loadProductionsIndexData(query: any) {
    let data = parseQueryDates(query)
    data.rate = data.rate || 0.1
    return request({
      url: `${API_ORIGIN}/data/website/getEfficiency`,
      data
    })
  },
  loadProductionIndexData(query: any) {
    let data = parseQueryDates(query)
    data.rate = data.rate || 0.1
    return request({
      url: `${API_ORIGIN}/data/website/getEfficiencyByProLindId`,
      data
    })
  },
  loadProductionPvData(query: any) {
    let data = parseQueryDates(query)
    data.pageNo = data.pageNo || 1
    data.pageSize = data.pageSize || constants.PAGE_SIZE
    return request({
      url: `${API_ORIGIN}/data/website/getEfficiencyByPage`,
      data
    }).then((res: any) => {
      const { apmList, count } = res
      if (!apmList) return Promise.reject({ code: 404, message: 'no server data' })
      apmList.forEach((item: any) => {
        Object.keys(item).forEach((key: string) => {
          if (FLOAT_VALUES[key]) {
            item[key] = parseFloat(item[key])
          }
        })
      })
      return {
        pageNo: data.pageNo,
        pageSize: data.pageSize,
        list: apmList,
        count
      }
    })
  },
  
  loadPvData(visitId: string) {
    return request({
      url: `${API_ORIGIN}/data/website/getEfficiencyByVisitId`,
      data: { visitId: visitId.replace(/-/, '') }
    }).then((res: any) => {
      Object.keys(res).forEach((key: string) => {
        if (FLOAT_VALUES[key]) {
          res[key] = parseFloat(res[key])
        }
      })
      res.resources = res.resources || []
      const { resources } = res
      resources.forEach((res: any, idx: number) => {
        res.key = idx
        Object.keys(res).forEach((key: string) => {
          if (FLOAT_VALUES[key]) {
            res[key] = parseFloat(res[key])
          }
        })
      })
      return res
    })
  },
  
}

function parseQueryDates(query: any) {
  let { dates, ...rest } = query
  rest.startTime = dates[0].format('Y-MM-DD 00:00:00')
  rest.endTime = dates[1].format('Y-MM-DD 23:59:59')
  return rest
}

const FLOAT_VALUES = {
  blankTime: true, 
  operableTime: true, 
  readyTime: true, 
  dnsTime: true, 
  tcpTime: true, 
  downloadTime: true, 
  duration: true
}