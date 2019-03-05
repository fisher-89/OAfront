import React, { PureComponent } from 'react';
import { Button, Popover, Input, message } from 'antd';


export default class extends PureComponent {
  state = {
    visible: false,
    inputdisable: true,
  }

  handleVisibleChange = (visible) => {
    this.setState({ visible, inputdisable: true });
  }

  handleInputInputDisableChange = () => {
    this.setState({ inputdisable: false });
  }

  keyEnter = (e, id) => {
    const { payFine } = this.props;
    const params = e.target.value;
    if (params < 5) {
      message.error('扣款金额应不少于五元');
    } else {
      payFine(id, params);
      this.setState({ inputdisable: true });
    }
  }

  render() {
    const { id, payFine, paytext } = this.props;
    const { visible, inputdisable } = this.state;
    const content = (
      <div>
        <Button onClick={() => payFine(id, '1')} icon="alipay" >支付宝支付</Button>
        <Button onClick={() => payFine(id, '2')} icon="wechat" >微信支付</Button>
        <Button onClick={() => this.handleInputInputDisableChange()} icon="dingding">工资扣款</Button>
        <Input disabled={inputdisable} type="number" style={{ position: 'relative', width: '80px', height: '31px' }} onPressEnter={e => this.keyEnter(e, id)} />
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
        <a >{paytext}</a>
      </Popover>
    );
  }
}
