import React from 'react';
import { Tabs, Icon, Empty } from 'tezign-ui';

const TabPane = Tabs.TabPane

export default function (props: any) {
  return (
    <div >
      <Empty size="large" image={Empty.IMAGES.NO_DATA} description="首页暂无内容" height={400}/>
    </div>
  );
}
