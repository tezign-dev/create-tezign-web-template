import React from 'react';
import { render } from 'react-dom';
import { LocaleProvider } from 'tezign-ui';
import enUS from 'tezign-ui/lib/locale-provider/en_US';
import zhCN from 'tezign-ui/lib/locale-provider/zh_CN';
import User from '@/services/user'
import Router from './router';
import history from '@/commons/history';
import constants from '@/commons/constants';
import '@/commons/g2/theme';
import './commons/styles/index.scss';

declare let module: { hot: any };

const user = User.get()
if (user) {
  User.afterLogin(user)
} else {
  // todo
  constants._prev_link = window.location.href
  history.push('/login')
}

render(
  <LocaleProvider locale={zhCN}>
    <Router user={user}/>
  </LocaleProvider>,
  document.getElementById('root'),
  () => {
    console.log('test render callback: ', performance.now())
  }
);

console.log('test callback: ', performance.now())

if (module.hot) module.hot.accept();
