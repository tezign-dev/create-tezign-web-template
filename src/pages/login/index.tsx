import React from 'react';
import { Icon, Input, wrapFormField, Button, message } from 'tezign-ui';
import User from '@/services/user'
import { history } from '@/commons/router';
import validFormFields from 'commons.js/functions/validFormFields'
import parseUrlParamsToObject from 'commons.js/functions/parseUrlParamsToObject'

import './index.scss'

export default class LoginPage extends React.Component<any, any> {
  servicePath: string;
  state: any = {
    fields: [{
      key: 'username',
      label: '用户名',
      component: <Input/>,
      placeholder: '请输入用户名',
      rules: [{
        required: true, message: '请输入用户名'
      }]
    }, {
      key: 'password',
      label: '密码',
      component: <Input type="password"/>,
      placeholder: '请输入密码',
      rules: [{
        required: true, message: '请输入密码'
      }]
    }]
  };

  submit = (e: any) => {
    e.preventDefault()
    const { fields } = this.state
    const { search } = this.props.location;
    const { redirect } = parseUrlParamsToObject(search);

    validFormFields(fields).then((data: any) => {
      User.login(data).then(() => {
        // 如果有重定向并且重定向地址不是登录页，则跳转至重定向页面
        if (redirect && redirect.indexOf('/login') === -1) {
          window.location.href = redirect
          // 这里刷新页面是为了刷新动态生成的 router，如果使用了 redux router 可以用 redux 的方式来刷新
          // 如果是跳转到其他站点，删除此行代码
          window.location.reload()
        } else {
          // 默认登录后跳转到首页
          history.push('/')
          // 这里刷新页面是为了刷新动态生成的 router，如果使用了 redux router 可以用 redux 的方式来刷新
          // 如果是跳转到其他站点，删除此行代码
          window.location.reload()
        }
      }, () => {
        message.error('登录失败')
      })
    })
  }

  render() {
    const { fields } = this.state;
    return (
      <div className="login-page">
        <div className="page-head">
          <Icon type="about-tezign" className="logo"/>
          Tezign
        </div>
        <form className="page-form" onSubmit={this.submit}>
          {
            fields.map((field: any, idx: number) => {
              if (field.hidden) return null
              return (
                <div key={field.key} className="form-field">
                  <div className="field-label">{field.label}</div>
                  <div className="field-control">
                    {wrapFormField(field, field.component)}
                  </div>
                </div>
              )
            })
          }
          <Button htmlType="submit" className="form-button" onClick={this.submit} block>登 录</Button>
        </form>
      </div>
    );
  }
}
