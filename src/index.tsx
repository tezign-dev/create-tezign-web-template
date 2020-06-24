import React from 'react';
import { render } from 'react-dom';
import { LocaleProvider } from 'tezign-ui';
import enUS from 'tezign-ui/lib/locale-provider/en_US';
import zhCN from 'tezign-ui/lib/locale-provider/zh_CN';
import User from '@/services/user'
import Root from './root';
import { history } from '@/commons/router';
import './index.scss';

declare let module: { hot: any };

const user = User.get()
// 判断用户状态
if (user) {
  User.afterLogin(user)
} else {
  // 如果没有登录，则跳转至登录页面并在登录后重定向
  const href = window.location.href
  let redirect = ''
  // 当前页面为登录页时不进行重定向
  if (href.indexOf('/login') === -1) {
    redirect = '?redirect=' + encodeURIComponent(href)
  }
  history.push('/login' + redirect)
}

render(
  <LocaleProvider locale={zhCN}>
    <Root user={user}/>
  </LocaleProvider>,
  document.getElementById('root'),
  () => {
    if (!document) return
    // 移除页面预加载模版
    let dom: any = document.getElementById('app-loading-skeleton')
    if (!dom) return
    // 消失动画的持续时间为 800 ms
    dom.className += ' hide'
    setTimeout(() => dom.parentNode.removeChild(dom), 800)
  }
);

if (module.hot) module.hot.accept();
