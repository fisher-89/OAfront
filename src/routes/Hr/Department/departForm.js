import React, { PureComponent } from 'react';
import {
  Input,
  Select,
  TreeSelect,
} from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import OAForm, { OAModal, SearchTable } from '../../../components/OAForm';
import { markTreeData } from '../../../utils/utils';

const { Option } = Select;
const FormItem = OAForm.Item;
@connect(({ brand, loading }) => ({
  brand: brand.brand,
  loading: loading.effects['brand/fetchBrand'],
}))
@OAForm.create()
export default class extends PureComponent {
  componentDidMount() {
    const { form, bindForm } = this.props;
    bindForm(form);
  }

  handleOnSuccess = () => {
    this.props.onCancel();
    this.props.dispatch(routerRedux.push('/hr/department'));
  }


  handleSubmit = (values) => {
    const { manager } = values;
    const { dispatch, onError } = this.props;

    dispatch({
      type: values.id ? 'department/editDepart' : 'department/addDepart',
      payload: {
        ...manager,
        ...values,
      },
      onSuccess: this.handleOnSuccess,
      onError,
    });
  }

  render() {
    const {
      brand,
      visible,
      form,
      initialValue,
      onCancel,
      onClose,
      treeData,
      validateFields,
      form: { getFieldDecorator },
    } = this.props;
    const newTreeData = markTreeData(treeData, { value: 'id', lable: 'name', parentId: 'parent_id' }, null);
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    return (
      <OAModal
        form={form}
        title="部门表单"
        visible={visible}
        onSubmit={validateFields(this.handleSubmit)}
        onCancel={() => onCancel(false)}
        afterClose={onClose}
      >
        {initialValue.id ? getFieldDecorator('id', {
          initialValue: initialValue.id,
        })(
          <Input placeholder="请输入" type="hidden" />
        ) : null}

        <FormItem
          label="名称"
          {...formItemLayout}
        >
          {getFieldDecorator('name', {
            initialValue: initialValue.name || '',
            rules: [
              {
                required: true,
                message: '必填内容',
              },
            ],
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
        <FormItem
          label="上级分类"
          {...formItemLayout}
        >
          {getFieldDecorator('parent_id', initialValue.parent_id ? {
            initialValue: initialValue.parent_id.toString(),
          } : { initialValue: null })(
            <TreeSelect
              placeholder="上级分类默认为空"
              treeDefaultExpandAll
              treeData={newTreeData}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            />
          )}
        </FormItem>
        <FormItem label="品牌" {...formItemLayout}>
          {getFieldDecorator('brand_id', {
            initialValue: initialValue.brand_id,
          })(
            <Select name="brand_id" placeholer="请选择" onChange={this.handleChange}>
              {brand && brand.map((item) => {
                return (
                  <Option key={item.id} value={item.id}>{item.name}</Option>
                );
              })}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="部门负责人">
          {
            getFieldDecorator('manager', {
              initialValue: {
                staff_sn: initialValue.manager_sn,
                staff_name: initialValue.manager_name,
              } || {},
            })(
              <SearchTable.Staff
                name={{
                  staff_sn: 'staff_sn',
                  staff_name: 'realname',
                }}
                showName="staff_name"
              />
            )
          }
        </FormItem>
      </OAModal>
    );
  }
}
