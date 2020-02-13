import React from 'react'
import { wrapFormField, Modal } from 'tezign-ui'
import cs from 'classnames'
import validFields from '@/commons/utils/validFields';

import './index.scss'

export { validFields }

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
