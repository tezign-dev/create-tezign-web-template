
const constants: any = {
  DOMAIN: '/',
  API_ORIGIN: 'https://dev-api.tezign.com',
  PAGE_SIZE: 20,
  STORAGE_KEYS: {
    USER: 'tz-user'
  }
};
// 根据环境来修改参数
if (__ENV__ === 'TEST') {
  constants.API_ORIGIN = 'https://test-api.tezign.com'
}
if (__ENV__ === 'PROD') {
  constants.API_ORIGIN = 'https://api.tezign.com'
}

export default constants;
