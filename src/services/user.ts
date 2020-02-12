import http from 'commons.js/http'
import json2form from 'commons.js/functions/json2form'
import constants from '@/commons/constants'

export default {
  login(user: any) {
    return http.post(`${constants.API_ORIGIN}/doLogin`, json2form(user))
  }
}