import fetch from 'isomorphic-fetch'
import json2formData from 'commons.js/functions/json2formData'

export default function(options: any) {
  const { method = 'POST', url, data } = options
  return fetch(url, {
    method,
    body: json2formData(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}