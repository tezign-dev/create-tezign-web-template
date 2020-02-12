import React from 'react';
import { Form, Icon, Input, Button, message } from 'tezign-ui';
import history from '@/commons/history';
import User from '@/services/user';

export default class LoginPage extends React.Component<any> {
  servicePath: string;
  state: {
    username: string;
    password: string;
  };
  constructor(props: any) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }
  render() {
    const { username, password } = this.state;
    return (
      <Form>
        <Form.Item>
          <Input
            value={username}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              this.setState({
                username: event.target.value
              });
            }}
            prefix={
              <Icon type='profile' style={{ color: 'rgba(0,0,0,.25)' }} />
            }
            placeholder='Username'
          />
        </Form.Item>
        <Form.Item>
          <Input
            value={password}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              this.setState({
                password: event.target.value
              });
            }}
            prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
            type='password'
            placeholder='Password'
          />
        </Form.Item>
        <Form.Item>
          <Button htmlType='submit' type='primary'>
            登录
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
