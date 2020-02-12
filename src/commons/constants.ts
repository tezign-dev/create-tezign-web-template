
const constants = {
  DOMAIN: '/',
  API_ORIGIN: 'https://test-track-admin.tezign.com/admin',
  PAGE_SIZE: 20
};
//
if (__ENV__ === 'PROD') {
  // do something
  constants.API_ORIGIN = 'https://track-admin.tezign.com/admin'
}

export default constants;
