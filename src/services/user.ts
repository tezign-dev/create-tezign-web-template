import constants from '@/commons/constants'
import storage from 'commons.js/storage'

const User = {
  login(data: any) {
    return Promise.resolve(data).then((user: any) => {
      User.afterLogin(user)
      return user
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