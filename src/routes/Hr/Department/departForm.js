import React, { PureComponent } from 'react';
import {
  Input,
  Select,
  TreeSelect,
} from 'antd';
import { connect } from 'dva';
import { assign } from 'lodash';
import { routerRedux } from 'dva/router';
import OAForm, { OAModal, SearchTable } from '../../../components/OAForm';
import { markTreeData } from '../../../utils/utils';

const { Option } = Select;
const FormItem = OAForm.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

@connect(({ brand, department, loading }) => ({
  brand: brand.brand,
  categories: department.category,
  loading: loading.effects['brand/fetchBrand'],
}))
@OAForm.create()
export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.flag = true;
    this.state = {
      area_manager_sn: false,
      regional_manager_sn: false,
      personnel_manager_sn: false,
    };
  }

  componentDidMount() {
    const { form, bindForm } = this.props;
    bindForm(form);
  }

  componentWillReceiveProps(nextProps) {
    const { initialValue: { category } } = nextProps;
    if (category !== null && category !== undefined && this.flag === true) {
      const visible = assign(...category.fields.map((item) => {
        return { [item]: true };
      }));
      this.flag = false;
      this.setState(visible);
    }
  }

  handleSubmit = (params) => {
    const { dispatch, onError } = this.props;
    dispatch({
      type: params.id ? 'department/editDepartment' : 'department/addDepartment',
      payload: {
        ...params,
        ...params.manager,
        ...params.area_manager,
        ...params.regional_manager,
        ...params.personnel_manager,
      },
      onError: errors => onError(errors),
      onSuccess: () => {
        this.props.onCancel();
        this.props.dispatch(routerRedux.push('/hr/department'));
      },
    });
  }

  handleChange = (cid) => {
    const { categories } = this.props;
    const hideFields = [];
    const showFields = [];
    categories.forEach((item) => {
      if (item.id === cid) {
        showFields.push(...item.fields);
      } else {
        hideFields.push(...item.fields);
      }
    });
    const show = assign(...showFields.map((item) => {
      return { [item]: true };
    }));
    const hide = assign(...hideFields.map((item) => {
      return { [item]: false };
    }));
    this.setState(hide, () => { this.setState(show); });
  }

  render() {
    const {
      brand,
      visible,
      form,
      onCancel,
      onClose,
      treeData,
      categories,
      initialValue,
      validateFields,
      validatorRequired,
      form: { getFieldDecorator },
    } = this.props;
    const newTreeData = markTreeData(treeData, { value: 'id', label: 'name', parentId: 'parent_id' }, 0);
    return (
      <OAModal
        form={form}
        title={initialValue.id ? '编辑部门' : '添加部门'}
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

        <FormItem label="名称" {...formItemLayout} required>
          {getFieldDecorator('name', {
            initialValue: initialValue.name || '',
            rules: [validatorRequired],
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>

        <FormItem label="所属分类" {...formItemLayout} required>
          {getFieldDecorator('cate_id', {
            initialValue: initialValue.cate_id || null,
            rules: [validatorRequired],
          })(
            <Select placeholer="请选择" onChange={this.handleChange}>
              {categories.map((item) => {
                return (<Option key={item.id} value={item.id}>{item.name}</Option>);
              })}
            </Select>
          )}
        </FormItem>
        {
          this.state.regional_manager_sn ? (
            <FormItem label="大区经理" {...formItemLayout}>
              {getFieldDecorator('regional_manager', {
                initialValue: {
                  regional_manager_sn: initialValue.regional_manager_sn,
                  regional_manager_name: initialValue.regional_manager_name,
                } || {},
              })(
                <SearchTable.Staff
                  name={{
                    regional_manager_sn: 'staff_sn',
                    regional_manager_name: 'realname',
                  }}
                  showName="regional_manager_name"
                />
              )}
            </FormItem>
          ) : null
        }
        {
          this.state.area_manager_sn ? (
            <FormItem label="区域经理" {...formItemLayout}>
              {getFieldDecorator('area_manager', {
                  initialValue: {
                    area_manager_sn: initialValue.area_manager_sn,
                    area_manager_name: initialValue.area_manager_name,
                  } || {},
              })(
                <SearchTable.Staff
                  name={{
                    area_manager_sn: 'staff_sn',
                    area_manager_name: 'realname',
                  }}
                  showName="area_manager_name"
                />
              )}
            </FormItem>
          ) : null
        }
        {
          this.state.personnel_manager_sn ? (
            <FormItem label="人事负责人" {...formItemLayout}>
              {getFieldDecorator('personnel_manager', {
                  initialValue: {
                    personnel_manager_sn: initialValue.personnel_manager_sn,
                    personnel_manager_name: initialValue.personnel_manager_name,
                  } || {},
              })(
                <SearchTable.Staff
                  name={{
                    personnel_manager_sn: 'staff_sn',
                    personnel_manager_name: 'realname',
                  }}
                  showName="personnel_manager_name"
                />
              )}
            </FormItem>
          ) : null
        }

        <FormItem label="上级部门" {...formItemLayout} >
          {getFieldDecorator('parent_id', initialValue.parent_id ? {
            initialValue: initialValue.parent_id.toString(),
          } : { initialValue: '' })(
            <TreeSelect
              placeholder="上级部门默认为空"
              treeDefaultExpandAll
              treeData={newTreeData}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            />
          )}
        </FormItem>

        <FormItem label="品牌" {...formItemLayout}>
          {getFieldDecorator('brand_id', {
            initialValue: initialValue.brand_id || 1,
          })(
            <Select name="brand_id" placeholer="请选择">
              {brand && brand.map((item) => {
                return (
                  <Option key={item.id} value={item.id}>{item.name}</Option>
                );
              })}
            </Select>
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="部门负责人">
          {getFieldDecorator('manager', {
              initialValue: {
                manager_sn: initialValue.manager_sn,
                manager_name: initialValue.manager_name,
              } || {},
            })(
              <SearchTable.Staff
                name={{
                  manager_sn: 'staff_sn',
                  manager_name: 'realname',
                }}
                showName="manager_name"
              />
          )}
        </FormItem>
      </OAModal>
    );
  }
}
