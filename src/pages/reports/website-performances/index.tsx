import React from 'react';
import { Tabs, Icon } from 'tezign-ui';
import BasicLayout from '@/layouts/Basic'

const TabPane = Tabs.TabPane

export default function (props: any) {
  return (
    <BasicLayout {...props}>
      <Tabs defaultActiveKey="1" type="radio-card">
        <TabPane tab={<div><Icon type="profile"/>个人简介</div>} key="1">weirth Content of tab 1</TabPane>
        <TabPane tab={<><Icon type="project-ex"/>项目经历</>} disabled key="2">Content of tab 2</TabPane>
        <TabPane tab={<><Icon type="work-ex"/>工作经历</>} key="3">Content of tab 3</TabPane>
        <TabPane tab={<><Icon type="learning-ex"/>学习经历</>} key="4">Content of tab 3</TabPane>
      </Tabs>
    </BasicLayout>
  );
}
