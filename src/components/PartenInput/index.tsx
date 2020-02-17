import React from 'react'
import { Input, Button, message } from 'tezign-ui'
import cs from 'classnames'
import Track from '@/services/track'

import './index.scss'

export default class PatternInput extends React.Component<any, any> {
  state: any = {
    verifyValue: '',
    verifyVisible: false,
    verifing: false,
    valid: undefined
  }

  handleVerifyChange = (e: any) => {
    // const { value } = this.props
    this.setState({
      verifyValue: e.target.value,
      // valid: new RegExp(value).test(e.target.value)
    })
  }

  toggleVerify = () => {
    const { verifyVisible } = this.state
    this.setState({ verifyVisible: !verifyVisible })
  }

  verfify = () => {
    const { value } = this.props
    const { verifyValue } = this.state
    if (!(value && verifyValue)) return
    this.setState({ verifing: true })
    Track.checkPatterUrl(value, verifyValue).then(() => {
      this.setState({ verifing: false, valid: true })
    }, () => {
      this.setState({ verifing: false, valid: false })
      message.error('url 匹配失败')
    })
  }

  render() {
    const { verifyVisible } = this.state
    let addon = (
      <span className="tz-action" onClick={this.toggleVerify}>
        {verifyVisible ? '关 闭' : '检 测'}
      </span>
    )
    return (
      <div className="pattern-input">
        <Input {...this.props} addonAfter={addon}/>
        {this.renderVerify()}
      </div>
    )
  }

  renderVerify() {
    const { verifyVisible, verifyValue, valid, verifing } = this.state
    if (!verifyVisible) return null
    let cls = 'verify-input'
    let suffix = null
    if (valid === true) {
      cls += ' status-success'
      suffix = '校验通过'
    } else if (valid === false) {
      cls += ' status-failure'
      suffix = '校验失败'
    }
    return (
      <div className={cls}>
        <div className="input-wrap">
          <Input 
            placeholder="请输入需要进行匹配的 url 地址"
            value={verifyValue} 
            onChange={this.handleVerifyChange}  
          />
        </div>
        <Button onClick={this.verfify} width={100} loading={verifing}>检 测</Button>  
      </div>
    )
  }
}
