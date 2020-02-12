import React from 'react'
import { Tag } from 'tezign-ui'
const StatusTag = Tag.StatusTag

export default function ({ status }: any) {
  return <StatusTag status={status ? 'success' : 'fail'} >{status ? '启用' : '禁用'}</StatusTag>
}