import constants from '@/commons/constants'
import request from '@/commons/requestForAdmin'
import storage from 'commons.js/storage'

const User = {
  login(data: any) {
    return request({
      url: `${constants.API_ORIGIN}/doLogin`,
      data
    }).then((res: any) => {
      const { code, message, result } = res
      if (code !== '0') return Promise.reject({ code, message })
      User.afterLogin(result)
      return result
    })
  },
  afterLogin(user: any) {
    storage.set(constants.STORAGE_KEYS.USER, user)
  },
  logout() {
    storage.remove(constants.STORAGE_KEYS.USER)
  },
  get() {
    return storage.get(constants.STORAGE_KEYS.USER)
  }
}

export default User