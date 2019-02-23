import React, { PureComponent } from 'react';
import { Select } from 'antd';
import OAForm, { OAModal } from '../../../components/OAForm';

const FormItem = OAForm.Item;
const { Option } = Select;
@OAForm.create()
export default class extends PureComponent {
  state = {
    qunhidden: false,
  }

  handleError = (error) => {
    const { onError } = this.props;
    onError(error, {
      push_id: 'push_id',
    });
  }

  handleSubmit = (value) => {
    const { dispatch, onCancel, pushgroup } = this.props;
    const sGroup = pushgroup.filter(item => item.default_push === 1);
    const SGroupId = sGroup.map(item => item.id);
    let params;
    if (value.push_type === '2') {
      params = {
        ...value,
        push_type: 2,
        push_id: SGroupId,
      };
    } else {
      params = {
        ...value,
        push_type: parseInt(value.push_type, 10),
      };
    }
    dispatch({
      type: 'violation/selfLogPush',
      payload: params,
      onSuccess: () => onCancel(false),
      onError: this.handleError,
    });
  }

  editPushGroup = () => {
    const { getFieldValue } = this.props.form;
    const { pushgroup } = this.props;
    function sortNumber(a, b) {
      return a - b;
    }
    const params = getFieldValue('push_id') ? getFieldValue('push_id') : [];
    const sGroup = pushgroup.filter(item => item.default_push === 1);
    const SGroupId = sGroup.map(item => item.id);
    const { dispatch } = this.props;
    if (params.length > 0 &&
      params.sort(sortNumber).toString() !== SGroupId.sort(sortNumber).toString()) {
      dispatch({
        type: 'violation/editPushQun',
        payload: params,
      });
    }
  }

  pushTypeChange = (params) => {
    if (params === '2') {
      this.setState({ qunhidden: true });
    } else {
      this.setState({ qunhidden: false });
    }
  }

  clear = () => {
    this.setState({ qunhidden: false });
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    const shortFormItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
    };
    const {
      visible,
      pushgroup,
      onCancel,
      keys,
      validateFields,
    } = this.props;
    const { qunhidden } = this.state;
    const { getFieldDecorator } = this.props.form;
    const sGroup = pushgroup.filter(item => item.default_push === 1);
    const SGroupId = sGroup.map(item => item.id);
    return (
      <OAModal
        title="推送"
        visible={visible}
        onCancel={() => onCancel(false)}
        onSubmit={validateFields(this.handleSubmit)}
        afterClose={this.clear}
      >
        {getFieldDecorator('id', {
          initialValue: keys,
        })(<input type="hidden" />)}
        <FormItem {...shortFormItemLayout} label="推送类型" required>
          {getFieldDecorator('push_type', {
            initialValue: '1',
          })(
            <Select onChange={value => this.pushTypeChange(value)} >
              <Option key="1" value="1">群推送</Option>
              <Option key="2" value="2">单人推送</Option>
              <Option key="3" value="3">群、单人推送</Option>
            </Select>)}
        </FormItem>
        <div hidden={qunhidden}>
          <FormItem {...formItemLayout} label="推送群" required>
            {getFieldDecorator('push_id', {
              initialValue: SGroupId,
            })(
              <Select mode="multiple" onBlur={() => this.editPushGroup()} >
                {pushgroup.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>{item.flock_name}</Option>
                  );
                })}
              </Select>)}
          </FormItem>
        </div>
      </OAModal>
    );
  }
}
