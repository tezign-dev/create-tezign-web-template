import React from 'react';
import { Table, Divider, Input, Icon, Button, Radio, message, Select } from 'tezign-ui';
import BasicLayout from '@/layouts/Basic'
import BizLine from '@/services/bizLine'
import StatusTag from '@/components/StatusTag'
import FormModal, { validFields } from '@/components/FormModal'

function initFields(record: any, context?: any) {
  const { id, bizLineName, status } = record
  return [{
    key: 'id',
    value: id,
    hidden: true
  }, {
    key: 'bizLineName',
    value: bizLineName,
    label: '业务线名称',
    component: <Input />,
    placeholder: '请输入业务线名称',
    rules: [{
      required: true, message: '请输入业务线名称'
    }, {
      min: 3, max: 20, message: '请输入 3 到 20 个字符'  
    }]      
  }, {
    key: 'status',
    value: status,
    label: '状 态',
    component: (
      <Radio.Group>
        <Radio.Button value={1}>启用</Radio.Button>
        <Radio.Button value={0}>禁用</Radio.Button>
      </Radio.Group>
    ) ,
  }]
}

export default class BizLineListPage extends React.Component<any, any> {
  
  state: any = { data: [], fmFieldOptions: { inline: true, labelWidth: 100 } }

  private columns = [{
    title: '业务线 ID',
    dataIndex: 'bizLineId',
    key: 'bizLineId',
  }, {
    title: '业务线名称',
    dataIndex: 'bizLineName',
    key: 'bizLineName',
  }, {
    title: '状态',
    key: 'status',
    dataIndex: 'status',
    render: (status: number) => <StatusTag status={status} />,
  }, {
    title: '操作',
    key: 'actions',
    render: (text: any, record: any) => (
      <span>
        <span className="tz-action" onClick={() => this.toEdit(record)}>编辑</span>
        <Divider type="vertical" />
        <span className="tz-action type-danger" onClick={() => this.toDelete(record)}>删除</span>
      </span>
    ),
  }]

  componentDidMount() {
    this.loadData()
  }

  loadData() {
    BizLine.getBizLines().then((data: any[]) => {
      this.setState({data})
    });
  }

  toAdd = () => {
    let fmFields = initFields({ status: 1 })
    this.setState({ fmTitle: '新增业务线', fmVisible: true, fmFields })
  }

  toEdit(record: any) { 
    let fmFields = initFields(record)
    this.setState({ fmTitle: '编辑业务线', fmVisible: true, fmFields })
  }

  toDelete(record: any) {

  }

  handleFormModalOk = () => {
    const { fmFields } = this.state
    validFields(fmFields).then((data: any) => {
      if (data.id) {
        BizLine.updateBizLine(data).then(() => {
          message.success('修改业务线成功')
          this.setState({ fmVisible: false })
          this.loadData()
        }, () => {
          message.error('修改业务线失败')
        })
      } else {
        BizLine.addBizLine(data).then(() => {
          message.success('新增业务线成功')
          this.setState({ fmVisible: false })
          this.loadData()
        }, () => {
          message.error('新增业务线失败')
        })
      }
    })
  }
  
  handleFormModalCancel = () => {
    this.setState({ fmVisible: false })
  }

  handleSearch = (value: string) => {

  }
  
  render () {
    const { data } = this.state
    return (
      <div >
        <div className="mb-16">
          <Input.Search 
            disabled
            allowClear
            placeholder="搜索业务线"
            onSearch={this.handleSearch}
            style={{width: 300}}
          />
          <Button className="float-right" onClick={this.toAdd}>
            <Icon className="mr-4" type="plus"/>
            添加
          </Button>  
        </div>
        <Table rowKey="id" columns={this.columns} dataSource={data} pagination={false}></Table> 
        {this.renderFormModal()}
      </div>
    ) 
  }

  renderFormModal() {
    const { fmTitle, fmVisible, fmFields, fmFieldOptions } = this.state
    if (!fmVisible) return null
    return (
      <FormModal 
        width={500} 
        visible={fmVisible} 
        fields={fmFields} 
        fieldOptions={fmFieldOptions} 
        title={fmTitle}
        onOk={this.handleFormModalOk}
        onCancel={this.handleFormModalCancel}
      /> 
    )
  }
  
}