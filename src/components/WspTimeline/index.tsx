import React from 'react'
import './index.scss'
import { Popover } from 'tezign-ui'

const COLORS: any = {
  readyTime: '#95979E',
  dnsTime: '#9DAFE0',
  tcpTime: '#DEC4FF',
  downloadTime: '#B7EB8F',
  domTime: '#FFE97A',
  jsTime: '#FFBFB8'
}

const LABELS = {
  readyTime: '等待时间',
  dnsTime: 'DNS 时间',
  tcpTime: 'TCP 时间',
  downloadTime: '下载时间',
  domTime: '首屏渲染时间',
  jsTime: 'JS 解析时间'
}

const TIME_KEYS = ['blankTime', 'operableTime', 'readyTime', 'dnsTime', 'tcpTime', 'downloadTime', 'duration']

export { TIME_KEYS }

export default function (props: any) {
  let { 
    colors = COLORS,
    max, 
    blankTime, operableTime, readyTime, dnsTime, tcpTime, downloadTime, duration,
    type = 'website',
    ...rest 
  } = props
  if (downloadTime < 0) return null
  let domTime, jsTime, popContent
  const times = [
    <div style={{ width: getWidth(readyTime, max), background: colors.readyTime }}/>,  
    <div style={{ width: getWidth(dnsTime, max), background: colors.dnsTime }}/>,   
    <div style={{ width: getWidth(tcpTime, max), background: colors.tcpTime }}/>,   
    <div style={{ width: getWidth(downloadTime, max), background: colors.downloadTime }}/>   
  ]
  if (type === 'resource') {
    popContent = renderContent({readyTime, dnsTime, tcpTime, downloadTime, colors, type})
  } else {
    
    if ((operableTime - blankTime) < 100) {
      jsTime = operableTime - readyTime - dnsTime - tcpTime - downloadTime
      popContent = renderContent({readyTime, dnsTime, tcpTime, downloadTime, jsTime, type: 'csr', colors})
      times.push(<div style={{ width: getWidth(jsTime, max), background: colors.jsTime }}/>)
    } else {
      domTime = blankTime - readyTime - dnsTime - tcpTime - downloadTime
      jsTime = operableTime - blankTime
      popContent = renderContent({readyTime, dnsTime, tcpTime, downloadTime, domTime, jsTime, colors})
      times.push(<div style={{ width: getWidth(domTime, max), background: colors.domTime }}/>)
      times.push(<div style={{ width: getWidth(jsTime, max), background: colors.jsTime }}/>)
    }
  }
  
  return (
    <Popover content={popContent} title="性能时间轴">
      <div {...rest} className="wsp-timeline">
        {times}           
      </div>
    </Popover>
  )
}

function renderContent(record: any) {
  const { colors = COLORS, type } = record
  let keys = ['readyTime', 'dnsTime', 'tcpTime', 'downloadTime', 'domTime', 'jsTime']
  if (type === 'resource') keys = keys.slice(0, 4)
  if (type === 'csr') keys.splice(4, 1)
  return (
    <div className="wsp-timeline-popup">
      {
        keys.map((key: string) => (
          <div key={key} className="popup-item">
            <span className="item-badge" style={{ background: colors[key] }}/>
            <span className="item-label">{LABELS[key]}</span>
            <span className="item-value">{parseFloatValue(record[key])} ms</span>  
          </div> 
        ))
      }
    </div>
  )
}

function parseFloatValue(value: number) {
  return value.toFixed(0)
}

function getWidth(value: number, max: number) {
  return (value / max) * 100 + '%'
}