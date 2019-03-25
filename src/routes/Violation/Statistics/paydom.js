import React, { PureComponent } from 'react';
import { Button, Popover } from 'antd';


export default class extends PureComponent {
  state = {
    visible: false,
  }

  handleVisibleChange = (visible) => {
    this.setState({ visible });
  }

  render() {
    const { id, payFine, paytext, disabled } = this.props;
    const { visible } = this.state;
    const onSuccess = () => this.handleVisibleChange(false);
    const content = (
      <div>
        <Button onClick={() => payFine(id, '1', onSuccess)} icon="alipay" >支付宝支付</Button>
        <Button onClick={() => payFine(id, '2', onSuccess)} icon="wechat" >微信支付</Button>
      </div>
    );
    return (
      <Popover
        placement="leftTop"
        content={content}
        trigger="click"
        visible={visible}
        onVisibleChange={this.handleVisibleChange}
      >
        <a disabled={disabled}>{paytext}</a>
      </Popover>
    );
  }
}
