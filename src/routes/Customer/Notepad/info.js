import React from 'react';
import { Drawer, Form } from 'antd';
import styles from './info.less';
import { getDataSourceIndex } from '../../../utils/utils';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 8, pull: 4 },
  wrapperCol: { span: 16, pull: 4 },
};

export default class extends React.PureComponent {
  render() {
    const restProps = { ...this.props };
    const { initialValue, brand } = restProps;
    delete restProps.initialValue;
    delete restProps.brand;
    const brands = initialValue.brands || [];
    const brandData = getDataSourceIndex(brand, brands);
    return (
      <Drawer
        {...restProps}
        width={540}
        title="详细信息"
      >
        <div className={styles.content}>
          <div className={styles.header}>
            <FormItem label="标题" {...formItemLayout}>{initialValue.title}</FormItem>
            <FormItem label="关联客户" {...formItemLayout}>{initialValue.client_name}</FormItem>
            <FormItem label="关联品牌" {...formItemLayout}>{brandData.join('、')}</FormItem>
            <FormItem label="记录时间" {...formItemLayout}>{(initialValue.created_at || {}).date}</FormItem>
            <FormItem label="记录人" {...formItemLayout}>{initialValue.recorder_name}</FormItem>
          </div>
          <div className={styles.viewer}>
            <div dangerouslySetInnerHTML={{ __html: initialValue.content }} />
          </div>
        </div>
      </Drawer>
    );
  }
}

