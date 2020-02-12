import constants from '@/commons/constants'
import request from '@/commons/requestForAdmin'

export default {
  searchEvents(query?: any) {
    query = query || { pageNumber: 1, pageSize: constants.PAGE_SIZE }
    return Promise.resolve(require('./mock-api/track.searchEvents.json')).then((data) => {
    // return http.post(`${constants.API_ORIGIN}/proBizLine/getList`, json2form(query)).then((data: any) => {
      data.pageNumber = query.pageNumber
      data.pageSize = query.pageSize
      return data
    })
  },
  updateEvent(data: any) {
    return request({
      url: `${constants.API_ORIGIN}/event/updateEventRule`, 
      data
    })
  },
  addEvent(data: any) {
    return request({
      url: `${constants.API_ORIGIN}/event/addEventRule`, 
      data
    })
  },
  searchLocations(query?: any) {
    query = query || { pageNumber: 1, pageSize: constants.PAGE_SIZE }
    return Promise.resolve(require('./mock-api/track.searchLocations.json')).then((data) => {
    // return http.post(`${constants.API_ORIGIN}/proBizLine/getList`, json2form(query)).then((data: any) => {
      data.pageNumber = query.pageNumber
      data.pageSize = query.pageSize
      return data
    })
  },
  updateLocation(data: any) {
    return request({
      url: `${constants.API_ORIGIN}/page/updatePageRule`, 
      data
    })
  },
  addLocation(data: any) {
    return request({
      url: `${constants.API_ORIGIN}/page/addPageRule`, 
      data
    })
  },
}