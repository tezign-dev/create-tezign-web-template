import React from 'react';
import { Empty } from 'tezign-ui';
// import each from 'commons.js/functions/each'

export default function (props: any) {
  // each([1,3,4])
  return (
    <Empty size="large" image={Empty.IMAGES.NO_DATA} description="暂无内容" height={400}/>
  );
}
