import React, { PureComponent } from 'react';
import OAForm, { OAModal } from '../../../components/OAForm';
import store from './store/store';

const FormItem = OAForm.Item;
@OAForm.create()
@store()
export default class extends PureComponent {
  render() {
    const {
      visible,
      onCancel,
    } = this.props;
    return (
      <OAModal
        visible={visible}
        title="大爱详情"
        onCancel={() => onCancel(false)}
        onSubmit={() => onCancel(false)}
      >
        <div>
          <FormItem lable="你好">sadad</FormItem>
        </div>
      </OAModal>
    );
  }
}
