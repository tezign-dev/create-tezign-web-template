import React from 'react';
import { render } from 'react-dom';
import { LocaleProvider } from 'tezign-ui';
import enUS from 'tezign-ui/lib/locale-provider/en_US';
import zhCN from 'tezign-ui/lib/locale-provider/zh_CN';
import './commons/styles/index.scss';
import http from 'commons.js/http'

http.defaults = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};

import Router from './router';

declare let module: { hot: any };

render(
  <LocaleProvider locale={zhCN}>
    <Router />
  </LocaleProvider>,
  document.getElementById('root')
);

if (module.hot) module.hot.accept();
