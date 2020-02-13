import React from 'react';
import { render } from 'react-dom';
import { LocaleProvider } from 'tezign-ui';
import enUS from 'tezign-ui/lib/locale-provider/en_US';
import zhCN from 'tezign-ui/lib/locale-provider/zh_CN';
import User from '@/services/user'
import Router from './router';
import history from '@/commons/history';
import './commons/styles/index.scss';


declare let module: { hot: any };

const user = User.get()
if (user) {
  User.afterLogin(user)
} else {
  history.push('/login')
}

render(
  <LocaleProvider locale={zhCN}>
    <Router user={user}/>
  </LocaleProvider>,
  document.getElementById('root')
);

if (module.hot) module.hot.accept();
