import fetch from 'isomorphic-fetch'
import json2formData from 'commons.js/functions/json2formData'
import merge from 'lodash/merge'
import pickBy from 'lodash/pickBy'
import identity from 'lodash/identity'

const defaults = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  }
}

export function config(options: any) {
  merge(defaults, options)
}

export default function(options: any) {
  const { method, url, data } = options
  return fetch(url, merge({}, defaults, {
    method,
    body: json2formData(pickBy(data, identity)),
  })).then((res: any) => {
    const { status } = res
    if (status !== 200) return Promise.reject({ code: status, message: '服务端异常' })
    return res.json()
  })
}