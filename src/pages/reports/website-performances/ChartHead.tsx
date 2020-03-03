import React from 'react'
import moment from 'moment'
import { DatePicker, Icon, InputNumber, Popover } from 'tezign-ui'

const { RangePicker } = DatePicker

const defaults: any = {
  ranges: { 
    '上周': [moment().subtract(1, 'week').startOf('week'), moment().subtract(1, 'week').endOf('week')], 
    '最近一周': [moment().subtract(1, 'week'), moment()], 
    '最近一月': [moment().subtract(1, 'month'), moment()],
    '最近三月': [moment().subtract(3, 'month'), moment()], 
  }
}

export default function (props: any) {
  const { dates, ranges = defaults.ranges, rate, title, onRateChange, onDatesChange } = props
  return (
    <div className="chart-head">
      <div className="head-title">{title}</div>
      <div className="head-gap" />
      <div>过滤比例</div>
      <Popover 
        placement="left"
        title="过滤比例说明"  
        content="按照加载耗时倒序排列，通过此值按比例过滤掉前面的数据"            
      >
        <Icon className="tz-action ml-4 mr-12" type="question"/>
      </Popover>
      <InputNumber value={rate * 100} style={{ width: 80 }} suffix="%" onChange={onRateChange} />
      <RangePicker 
        style={{ width: 250 }}
        className="ml-16" 
        value={dates} 
        onChange={onDatesChange}
        ranges={ranges}
      />  
    </div>
  )
}