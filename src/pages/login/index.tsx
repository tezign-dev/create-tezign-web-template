import React from 'react';
import cs from 'classnames';
import { Form, Icon, Input, wrapFormField, Button, message } from 'tezign-ui';
import validFields from '@/commons/utils/validFields';
import User from '@/services/user'
import history from '@/commons/history';

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
    validFields(fields).then((data: any) => {
      User.login(data).then(() => {
        history.push('/')
        window.location.reload()
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
          数据中台
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
