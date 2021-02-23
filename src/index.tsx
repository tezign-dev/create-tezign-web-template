import React from 'react';
import { render } from 'react-dom';
import { LocaleProvider } from 'tezign-ui';
import enUS from 'tezign-ui/lib/locale-provider/en_US';
import zhCN from 'tezign-ui/lib/locale-provider/zh_CN';
import User from '@/services/user';
import Router from './router';
import './index.scss';

declare let module: { hot: any };

const user = User.get();
// 判断用户状态
if (user) {
  User.afterLogin(user);
} else {
  // 如果没有登录，则跳转至登录页面并在登录后重定向
  const href = window.location.href;
  // 先判断当前页面不是登录页，如果是不做处理
  if (href.indexOf('/login') === -1) {
    const redirect = '?redirect=' + encodeURIComponent(href);
    window.location.href = '/login' + redirect;
  }
}

render(
  <LocaleProvider locale={zhCN}>
    <Router user={user} />
  </LocaleProvider>,
  document.getElementById('root'),
  () => {
    if (!document) return;
    // 移除页面预加载模版
    const dom: any = document.getElementById('app-loading-skeleton');
    if (!dom) return;
    // 消失动画的持续时间为 800 ms
    dom.className += ' hide';
    setTimeout(() => dom.parentNode.removeChild(dom), 800);
  },
);
