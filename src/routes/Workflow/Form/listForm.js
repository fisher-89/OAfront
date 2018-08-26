import React from 'react';
import { connect } from 'dva';
import {
  Input,
  Select,
  Row,
  Col,
  Switch,
  Radio,
  TreeSelect,
  InputNumber,
} from 'antd';
import OAForm, {
  InputTags,
  OAModal,
  SearchTable,
} from '../../../components/OAForm';
import TagInput from '../../../components/TagInput';
import { markTreeData } from '../../../utils/utils';

const FormItem = OAForm.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;

const fieldsBoxLayout = { span: 12 };
const fieldsItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 8 } },
  wrapperCol: { xs: { span: 24 }, lg: { span: 12 } },
};

export const fieldsTypes = [
  { value: 'text', text: '文本' },
  { value: 'int', text: '数字' },
  { value: 'date', text: '日期' },
  { value: 'datetime', text: '日期时间' },
  { value: 'time', text: '时间' },
  { value: 'array', text: '数组' },
  { value: 'file', text: '文件' },
  { value: 'region', text: '地区' },
  { value: 'department', text: '部门控件' },
  { value: 'staff', text: '员工控件' },
  { value: 'shop', text: '店铺控件' },
];

export const labelText = {
  name: '名称',
  key: '键名',
  type: '字段类型',
  is_checkbox: '是否多选',
  condition: '条件',
  region_level: '地区级数',
  oa_id: '关联编号',
  scale: '小数位数',
  min: '最小值',
  max: '最大值',
  options: '可选值',
  validator_id: '验证规则',
  default_value: '默认值',
  description: '描述',
};


@connect(({ department, workflow, loading }) => ({
  loading: (
    loading.effects['workflow/fetchValidator']
  ),
  department: department.department,
  validator: workflow.validator,
}))
@OAForm.create()
export default class extends React.PureComponent {
  componentWillReceiveProps(nextProps) {
    const { error, onError } = nextProps;
    if (Object.keys(error).length && error !== this.props.error) {
      onError(error, false);
    }
  }

  labelValue = labelText;

  handleOk = (value) => {
    const { initialValue, config: { onOk } } = this.props;
    const isCheckbox = value.is_checkbox ? 1 : 0;
    let oaId = value.oa_id || [];
    if (value.type === 'staff') {
      oaId = value.oa_id.map(item => (item.staff_sn));
    } else if (value.type === 'shop') {
      oaId = value.oa_id.map(item => (item.shop_sn));
    }
    onOk({
      condition: '',
      region_level: null,
      ...initialValue,
      ...value,
      is_checkbox: isCheckbox,
      oa_id: oaId,
    });
  }

  fetchDepartment = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'department/fetchDepartment' });
  };


  renderRegion = () => {
    const { labelValue } = this;
    const { initialValue, form: { getFieldDecorator } } = this.props;
    return (
      <FormItem label={labelValue.region_level} {...fieldsItemLayout}>
        {getFieldDecorator('region_level', {
          initialValue: initialValue.region_level || null,
        })(
          <RadioGroup>
            <Radio value="3">省/市/区</Radio>
            <Radio value="2">省/市</Radio>
            <Radio value="1">省</Radio>
          </RadioGroup>
        )}
      </FormItem>
    );
  }

  renderDepartment = () => {
    const { labelValue } = this;
    const { department } = this.props;
    const { initialValue, form: { getFieldDecorator } } = this.props;
    const departmentTree = markTreeData(
      department, {
        parentId: 'parent_id',
        value: 'id',
        lable: 'full_name',
      }, 0);
    return (
      <FormItem label={labelValue.oa_id} {...fieldsItemLayout}>
        {getFieldDecorator('oa_id', {
          initialValue: initialValue.oa_id || [],
        })(
          <TreeSelect
            multiple
            allowClear
            placeholder="请选择部门"
            treeData={departmentTree}
            getPopupContainer={triggerNode => triggerNode}
            dropdownStyle={{ maxHeight: '300px', overflow: 'auto' }}
          />
        )}
      </FormItem>
    );
  }

  renderStaff = () => {
    const { labelValue } = this;
    const { initialValue, form: { getFieldDecorator } } = this.props;
    const oaId = (initialValue.oa_id || []).map(item => ({ staff_sn: item }));
    return (
      <FormItem label={labelValue.oa_id} {...fieldsItemLayout}>
        {getFieldDecorator('oa_id', {
          initialValue: oaId,
        })(
          <SearchTable.Staff
            multiple
            showName="staff_sn"
            placeholder="请选择"
            name={{ staff_sn: 'staff_sn' }}
          />
        )}
      </FormItem>
    );
  }

  renderShop = () => {
    const { labelValue } = this;
    const { initialValue, form: { getFieldDecorator } } = this.props;
    const oaId = (initialValue.oa_id || []).map(item => ({ shop_sn: item }));
    return (
      <FormItem label={labelValue.oa_id} {...fieldsItemLayout}>
        {getFieldDecorator('oa_id', {
          initialValue: oaId,
        })(
          <SearchTable.Shop
            multiple
            showName="shop_sn"
            placeholder="请选择"
            name={{ shop_sn: 'shop_sn' }}
          />
        )}
      </FormItem>
    );
  }

  renderCheckBoxExtar = () => {
    const { initialValue, form: { getFieldDecorator } } = this.props;
    const { labelValue } = this;
    return (
      <FormItem label={labelValue.is_checkbox} {...fieldsItemLayout}>
        {
          getFieldDecorator('is_checkbox', {
            initialValue: initialValue.is_checkbox === 1 || false,
            valuePropName: 'checked',
          })(
            <Switch />
          )
        }
      </FormItem>
    );
  }

  renderStaffCondition = () => {
    const { initialValue, form: { getFieldDecorator } } = this.props;
    const { labelValue } = this;
    return (
      <FormItem label={labelValue.condition} {...fieldsItemLayout}>
        {
          getFieldDecorator('condition', {
            initialValue: initialValue.condition || '',
          })(
            <Input placeholder="请输入" />
          )
        }
      </FormItem>
    );
  }

  renderTypeComponent = () => {
    const { form: { getFieldValue } } = this.props;
    const typeValue = getFieldValue('type');
    let render;
    let extarRender = [];
    switch (typeValue) {
      case 'region':
        render = this.renderRegion();
        break;
      case 'department':
        this.fetchDepartment();
        render = this.renderDepartment();
        extarRender = [this.renderCheckBoxExtar()];
        break;
      case 'staff':
        render = this.renderStaff();
        extarRender = [this.renderCheckBoxExtar(), this.renderStaffCondition()];
        break;
      case 'shop':
        render = this.renderShop();
        extarRender = [this.renderCheckBoxExtar()];
        break;
      default:
        break;
    }
    return render ? (
      [
        ...extarRender,
        render,
      ]
    ) : [];
  }

  render() {
    const {
      initialValue, validator, dataSource, form, validateFields, validatorRequired,
    } = this.props;
    const { getFieldDecorator } = form;
    const fields = dataSource.map((item) => {
      return { key: item.key, name: item.name };
    });
    const modalProps = { ...this.props.config };
    delete modalProps.onOK;
    const { labelValue } = this;

    return (
      <OAModal {...modalProps} width={950} onSubmit={validateFields(this.handleOk)}>
        <Row>
          <Col {...fieldsBoxLayout}>
            <FormItem label={labelValue.name} {...fieldsItemLayout}>
              {
                getFieldDecorator('name', {
                  initialValue: initialValue.name || '',
                  rules: [validatorRequired],
                })(
                  <Input placeholder="请输入" />
                )
              }
            </FormItem>
          </Col>
          <Col {...fieldsBoxLayout}>
            <FormItem label={labelValue.key} {...fieldsItemLayout}>
              {
                getFieldDecorator('key', {
                  initialValue: initialValue.key || '',
                  rules: [validatorRequired],
                })(
                  <Input placeholder="请输入" />
                )
              }
            </FormItem>
          </Col>
          <Col {...fieldsBoxLayout}>
            <FormItem label={labelValue.type} {...fieldsItemLayout}>
              {
                getFieldDecorator('type', {
                  initialValue: initialValue.type || [],
                  rules: [validatorRequired],
                })(
                  <Select getPopupContainer={triggerNode => triggerNode} placeholder="请选择" style={{ width: '100%' }} >
                    {fieldsTypes.map(item => <Option key={item.value}>{item.text}</Option>)}
                  </Select>
                )
              }
            </FormItem>
          </Col>
          {this.renderTypeComponent().map((item, index) => {
            const key = `key-${index}`;
            return (
              <Col {...fieldsBoxLayout} key={key}>
                {item}
              </Col>
            );
          })}
          <Col {...fieldsBoxLayout}>
            <FormItem label={labelValue.scale} {...fieldsItemLayout}>
              {
                getFieldDecorator('scale', {
                  initialValue: initialValue.scale || 0,
                })(
                  <InputNumber placeholder="请输入" min={0} style={{ width: '100%' }} />
                )
              }
            </FormItem>
          </Col>
          <Col {...fieldsBoxLayout}>
            <FormItem label={labelValue.min} {...fieldsItemLayout}>
              {
                getFieldDecorator('min', {
                  initialValue: initialValue.min || '',
                })(
                  <InputNumber placeholder="请输入" min={0} style={{ width: '100%' }} />
                )
              }
            </FormItem>
          </Col>
          <Col {...fieldsBoxLayout}>
            <FormItem label={labelValue.max} {...fieldsItemLayout}>
              {
                getFieldDecorator('max', {
                  initialValue: initialValue.max || '',
                })(
                  <InputNumber placeholder="请输入" min={0} style={{ width: '100%' }} />
                )
              }
            </FormItem>
          </Col>
          <Col {...fieldsBoxLayout}>
            <FormItem label={labelValue.options} {...fieldsItemLayout}>
              {
                getFieldDecorator('options', {
                  initialValue: initialValue.options || [],
                })(
                  <TagInput name="options" />
                )
              }
            </FormItem>
          </Col>

          <Col {...fieldsBoxLayout}>
            <FormItem label={labelValue.validator_id} {...fieldsItemLayout}>
              {
                getFieldDecorator('validator_id', {
                  initialValue: initialValue.validator_id || [],
                })(
                  <Select mode="multiple" style={{ width: '100%' }} placeholder="请选择" >
                    {
                      validator.map(item => (
                        <Option key={item.id} value={item.id}>{item.name}</Option>
                      ))
                    }
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem
              label={labelValue.default_value}
              labelCol={{ xs: { span: 24 }, sm: { span: 8 }, lg: { span: 4 } }}
              wrapperCol={{ xs: { span: 24 }, sm: { span: 16 }, lg: { span: 18 } }}
            >
              {
                getFieldDecorator('default_value', {
                  initialValue: initialValue.default_value || '',
                })(
                  <InputTags placeholder="请输入" fields={fields} />
                )
              }
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem
              label={labelValue.description}
              labelCol={{ xs: { span: 24 }, sm: { span: 8 }, lg: { span: 4 } }}
              wrapperCol={{ xs: { span: 24 }, sm: { span: 16 }, lg: { span: 18 } }}
            >
              {
                getFieldDecorator('description', {
                  initialValue: initialValue.description || '',
                })(
                  <Input placeholder="请输入" name="description" />
                )
              }
            </FormItem>
          </Col>
        </Row>
      </OAModal>
    );
  }
}
