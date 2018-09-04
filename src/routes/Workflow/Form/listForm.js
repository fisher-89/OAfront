import React from 'react';
import moment from 'moment';
import { connect } from 'dva';
import classNames from 'classnames';
import {
  Input,
  Select,
  Row,
  Col,
  Switch,
  Radio,
  Checkbox,
  TimePicker,
  InputNumber,
} from 'antd';
import OAForm, {
  InputTags,
  OAModal,
  SearchTable,
  DatePicker,
  Address,
  TreeSelect,
} from '../../../components/OAForm';
import TagInput from '../../../components/TagInput';
import styles from './index.less';

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


const fieldScale = ['int'];

const fieldOptions = ['array'];

const fieldMinAndMax = ['int', 'text'];

const fieldIsCheckbox = ['department', 'staff', 'shop', 'array'];

const defaultValueComponent = ['int', 'text'];


@connect(({ department, workflow, loading }) => ({
  loading: (
    loading.effects['workflow/fetchValidator']
  ),
  department: department.department,
  validator: workflow.validator,
}))
@OAForm.create()
export default class extends React.PureComponent {
  state = {
    checkValue: null,
  }

  componentWillMount() {
    this.fetchDepartment();
  }

  componentWillReceiveProps(nextProps) {
    const { error, onError } = nextProps;
    if (Object.keys(error).length && error !== this.props.error) {
      onError(error, false);
    }
  }

  getTypeDefaultComponent = (type) => {
    const { initialValue } = this.props;
    const {
      getFieldValue,
      getFieldsValue,
      setFieldsValue,
      getFieldDecorator,
    } = this.props.form;
    const whereValue = getFieldsValue(['is_checkbox']);
    const value = initialValue.default_value ?
      initialValue.default_value : whereValue.is_checkbox ? [] : undefined;
    const multiple = whereValue.is_checkbox;
    if (['date', 'datetime'].indexOf(type) !== -1) {
      const format = type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm';
      return getFieldDecorator('default_value', {
        initialValue: initialValue.default_value || '',
      })(
        <DatePicker format={format} showTime={type !== 'date'} />
      );
    } else if (type === 'time') {
      return getFieldDecorator('default_value', {
        initialValue:
          initialValue.default_value ? moment(initialValue.default_value, 'HH:mm:ss') : undefined,
      })(
        <TimePicker
          onChange={(_, timStr) => {
            setFieldsValue({ default_value: timStr });
          }}
        />
      );
    } else if (type === 'array') {
      const { options } = getFieldsValue(['options']);
      const mode = whereValue.is_checkbox ? { mode: 'multiple' } : {};
      return getFieldDecorator('default_value', {
        initialValue: value,
      })(
        <Select {...mode} placeholder="请选择">
          {options.map((item, index) => {
            const key = `${index}`;
            return (
              <Option key={key} value={item}>{item}</Option>
            );
          })}
        </Select>
      );
    } else if (['staff', 'shop', 'department'].indexOf(type) !== -1) {
      let defaultValue = value;
      defaultValue = !multiple && !defaultValue ? {} : defaultValue;
      const selectType = this.makeSelectDefaultValue(defaultValue);
      if (selectType !== false) return selectType;
      const commoProps = {
        multiple,
        showName: 'text',
      };
      const { department } = this.props;
      console.log(defaultValue);
      return getFieldDecorator('default_value', {
        initialValue: defaultValue,
      })(
        type === 'staff' ? (
          <SearchTable.Staff
            {...commoProps}
            name={{ text: 'realname', value: 'staff_sn' }}
          />
        ) :
          type === 'shop' ?
            (
              <SearchTable.Shop
                {...commoProps}
                name={{ value: 'shop_sn', text: 'name' }}
              />
            ) :
            (
              <TreeSelect
                parentValue={0}
                multiple={multiple}
                dataSource={department}
                name={{ value: 'id', text: 'full_name' }}
                getPopupContainer={triggerNode => (triggerNode)}
                dropdownStyle={{ maxHeight: '300px', overflow: 'auto' }}
              />
            )
      );
    } else if (type === 'region') {
      const defaultValue = initialValue.default_value || {};
      const regionLevel = getFieldValue('region_level');
      let disabled = {};
      if (regionLevel === '1') {
        disabled = {
          city: true,
          county: true,
          address: true,
        };
      } else if (regionLevel === '2') {
        disabled = { county: true, address: true };
      } else if (regionLevel === '3') {
        disabled = { address: true };
      }
      return getFieldDecorator('default_value', {
        initialValue: defaultValue,
      })(
        <Address disabled={disabled} />
      );
    }
    return null;
  }

  getDefaultComponent = (fields, type) => {
    const { initialValue } = this.props;
    const { getFieldDecorator } = this.props.form;
    if (defaultValueComponent.indexOf(type) !== -1) {
      return getFieldDecorator('default_value', {
        initialValue: initialValue.default_value || '',
      })(
        <InputTags placeholder="请输入" fields={fields} />
      );
    } else {
      return this.getTypeDefaultComponent(type);
    }
  }


  labelValue = labelText;

  makeSelectDefaultValue = (defaultValue) => {
    const { getFieldValue, getFieldDecorator } = this.props.form;
    const sourceData = getFieldValue('oa_id');
    if (!sourceData || (!Object.keys(sourceData).length || !sourceData.length)) {
      return false;
    }
    const isCheckbox = getFieldValue('is_checkbox');
    const mode = isCheckbox ? { mode: 'multiple' } : {};
    return getFieldDecorator('default_value', {
      initialValue: defaultValue,
    })(
      <Select {...mode} placeholder="请选择">
        {sourceData.map((item) => {
          return (
            <Option key={item.value} >{item.text}</Option>
          );
        })}
      </Select>
    );
  }

  handleTypeChange = () => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ default_value: null });
    this.setState({ checkValue: null });
  }

  handleCurrentChange = (e) => {
    const { getFieldsValue, setFieldsValue } = this.props.form;
    const whereConfig = getFieldsValue(['is_checkbox', 'type', 'default_value']);
    const { checked } = e.target;
    const current = {
      value: whereConfig.type,
      text: this.currentlabelText,
    };
    let defaultValue;
    if (checked && whereConfig.is_checkbox) {
      defaultValue = whereConfig.default_value || [];
      defaultValue.push(current);
    } else if (checked && !whereConfig.is_checkbox) {
      defaultValue = current;
    } else if (whereConfig.is_checkbox) {
      defaultValue = whereConfig.default_value.filter(item => item.value === current.value);
    } else {
      defaultValue = {};
    }
    setFieldsValue({ default_value: defaultValue });
    this.setState({ checkValue: e.target.checked ? '1' : null });
  }


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
      min: initialValue.min || value.min || '',
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
          initialValue: `${initialValue.region_level || 3}`,
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
    return (
      <FormItem label={labelValue.oa_id} {...fieldsItemLayout}>
        {getFieldDecorator('oa_id', {
          initialValue: initialValue.oa_id || [],
        })(
          <TreeSelect
            multiple
            parentValue={0}
            fields={{
              parentId: 'parent_id',
              value: 'id',
              lable: 'full_name',
            }}
            dataSource={department}
            getPopupContainer={triggerNode => (triggerNode)}
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
            showName="text"
            placeholder="请选择"
            name={{ value: 'staff_sn', text: 'realname' }}
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
        render = this.renderDepartment();
        break;
      case 'staff':
        render = this.renderStaff();
        extarRender = [this.renderStaffCondition()];
        break;
      case 'shop':
        render = this.renderShop();
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
    const { getFieldDecorator, getFieldValue } = form;
    const fields = dataSource.map((item) => {
      return { key: item.key, name: item.name };
    });
    const modalProps = { ...this.props.config };
    delete modalProps.onOK;
    const { labelValue } = this;
    const fieldType = getFieldValue('type');
    const scaleCls = classNames({
      [styles.disblock]: fieldScale.indexOf(fieldType) === -1,
    });
    const optionsCls = classNames({
      [styles.disblock]: fieldOptions.indexOf(fieldType) === -1,
    });
    const maxAndMinCls = classNames({
      [styles.disblock]: fieldMinAndMax.indexOf(fieldType) === -1,
    });
    const isCheckboxCls = classNames({
      [styles.disblock]: fieldIsCheckbox.indexOf(fieldType) === -1,
    });
    const notDefaultValue = ['file'];
    const defaultCls = classNames({
      [styles.disblock]: !fieldType || notDefaultValue.indexOf(fieldType) !== -1,
    });
    let currentlabelText = (
      (fieldsTypes.find(item => item.value === fieldType) || {}).text || ''
    ).replace('控件', '');
    currentlabelText = `当前${currentlabelText}`;
    this.currentlabelText = currentlabelText;
    const currentCls = classNames({
      [styles.disblock]: !fieldType || ['staff', 'shop', 'department'].indexOf(fieldType) === -1,
    });

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
                  initialValue: initialValue.type || undefined,
                  rules: [validatorRequired],
                })(
                  <Select
                    placeholder="请选择"
                    style={{ width: '100%' }}
                    getPopupContainer={triggerNode => (triggerNode)}
                    onChange={this.handleTypeChange}
                  >
                    {fieldsTypes.map(item => (
                      <Option key={item.value} value={item.value}>{item.text}</Option>
                    ))}
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col {...fieldsBoxLayout} className={isCheckboxCls}>
            <FormItem label={labelValue.is_checkbox} {...fieldsItemLayout} >
              {
                getFieldDecorator('is_checkbox', {
                  initialValue: initialValue.is_checkbox === 1 || false,
                  valuePropName: 'checked',
                })(
                  <Switch />
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
          <Col {...fieldsBoxLayout} className={scaleCls || ''}>
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
          <Col {...fieldsBoxLayout} className={maxAndMinCls}>
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
          <Col {...fieldsBoxLayout} className={maxAndMinCls}>
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
          <Col {...fieldsBoxLayout} className={optionsCls}>
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
                  <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="请选择"
                    getPopupContainer={triggerNode => (triggerNode)}
                  >
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
          <Col {...fieldsBoxLayout}>
            <FormItem label={labelValue.description} {...fieldsItemLayout}>
              {
                getFieldDecorator('description', {
                  initialValue: initialValue.description || '',
                })(
                  <Input placeholder="请输入" name="description" />
                )
              }
            </FormItem>
          </Col>
          <Col span={24} className={defaultCls}>
            <FormItem
              label={labelValue.default_value}
              labelCol={{ xs: { span: 24 }, sm: { span: 8 }, lg: { span: 4 } }}
              wrapperCol={{ xs: { span: 24 }, sm: { span: 16 }, lg: { span: 18 } }}
            >
              {this.getDefaultComponent(fields, fieldType)}
            </FormItem>
          </Col>
          <Col span={24} className={currentCls}>
            <FormItem
              label={currentlabelText}
              labelCol={{ xs: { span: 24 }, sm: { span: 8 }, lg: { span: 4 } }}
              wrapperCol={{ xs: { span: 24 }, sm: { span: 16 }, lg: { span: 18 } }}
            >
              <Checkbox
                value="1"
                checked={this.state.checkValue === '1'}
                onChange={this.handleCurrentChange}
              />
            </FormItem>
          </Col>
        </Row>
      </OAModal>
    );
  }
}
