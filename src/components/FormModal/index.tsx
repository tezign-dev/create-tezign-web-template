import React from 'react'
import { wrapFormField, Modal } from 'tezign-ui'
import cs from 'classnames'
import './index.scss'

export default function (props: any) {
  let { title, visible, fields, fieldOptions, className = '', ...rest } = props
  className += ' form-modal'
  const { inline, labelWidth = '100%' } = fieldOptions
  return (
    <Modal
      title={title}
      visible={visible}
      className={className}
      {...rest}
    >
      {
        fields.map((field: any, idx: number) => {
          if (field.hidden) return null
          return (
            <div key={field.key} className={cs('form-field', { 'type-inline': inline })}>
              <div className="field-label" style={{ width: labelWidth}}>{field.label}</div>
              <div className="field-control">
                {wrapFormField(field, field.component)}
              </div>
            </div>
          )
        })
      }
    </Modal>
  )
}

export function validFields(fields: any[]) {
  const invalid = fields.some((field: any) => {
    // 如果有错误或者正在校验中，返回
    return field.error || field.validating      
  })    
  if (invalid) return Promise.reject()
  //全量校验，都通过校验后提交数据
  const fc = fields.filter(field => !field.hidden).map(field => field.valid())
  return Promise.all(fc)
}
