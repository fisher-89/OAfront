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
  Card,
  InputNumber,
} from 'antd';
import OAForm, {
  OAModal,
  Address,
  InputTags,
  TreeSelect,
  SearchTable,
  DatePicker,
} from '../../../components/OAForm';
import {
  RadioDate,
  RadioTime,
  RadioShop,
  RadioStaff,
  RadioSelect,
  RadioDepartment,
} from './ListFormComponent';
import TimePicker from './ListFormComponent/timePicker';
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

const fieldsRowItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 8 }, lg: { span: 4 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 16 }, lg: { span: 18 } },
};

export const fieldsTypes = [
  { value: 'text', text: '文本' },
  { value: 'int', text: '数字' },
  { value: 'time', text: '时间（时:分:秒）' },
  { value: 'date', text: '日期（年-月-日）' },
  { value: 'datetime', text: '日期时间（年-月-日 时:分）' },
  { value: 'select', text: '选择控件' },
  { value: 'array', text: '多输入控件' },
  { value: 'file', text: '文件' },
  { value: 'region', text: '地区' },
  { value: 'department', text: '部门控件' },
  { value: 'staff', text: '员工控件' },
  { value: 'shop', text: '店铺控件' },
];

export const labelText = {
  name: '名称',
  key: '键名',
  type: '控件类型',
  is_checkbox: '是否多选',
  condition: '筛选条件',
  region_level: '地区级数',
  available_options: '可选项',
  scale: '小数位数',
  min: '最小值',
  max: '最大值',
  options: '可选值',
  validator_id: '验证规则',
  default_value: '默认值',
  description: '输入提示',
};

const resetFields = {
  options: [],
  min: undefined,
  max: undefined,
  scale: undefined,
  condition: undefined,
  region_level: undefined,
  default_value: undefined,
  available_options: undefined,
};


const fieldScale = ['int'];

const fieldOptions = ['select'];

const timePickerCom = ['time', 'date', 'datetime'];

const defaultValueComponent = [...fieldScale, 'text'];

const fieldIsCheckbox = ['department', 'staff', 'shop', ...fieldOptions];

const fieldMinAndMax = [
  'array',
  ...timePickerCom,
  ...fieldIsCheckbox,
  ...defaultValueComponent,
];

const requiredCheckBox = [...fieldScale, 'array'];

@connect(({ department, workflow, loading }) => ({
  loading: (
    loading.effects['workflow/fetchValidator']
  ),
  department: department.department,
  validator: workflow.validator,
}))
@OAForm.create()
export default class extends React.PureComponent {
  componentWillMount() {
    this.fetchDepartment();
  }

  componentWillReceiveProps(nextProps) {
    const { error, onError } = nextProps;
    if (Object.keys(error).length && error !== this.props.error) {
      onError(error, false);
    }
  }

  getFieldTypeText = (type) => {
    const fieldType = fieldsTypes.find(item => item.value === type);
    return fieldType.text || '';
  }

  getMultiple = () => {
    const { getFieldValue } = this.props.form;
    return getFieldValue('is_checkbox');
  }

  getDateComponent = (initialValue, type) => {
    const { getFieldDecorator, getFieldsValue } = this.props.form;
    const fieldType = this.getFieldTypeText(type);
    const { min, max } = getFieldsValue(['min', 'max']);
    return getFieldDecorator('default_value', {
      initialValue: initialValue || '',
      rules: [{
        validator: this.validateFiledsDefaultValue,
      }],
    })(
      <RadioDate
        type={type}
        fieldType={fieldType}
        disabledDate={(currentDate) => {
          const validateTime = this.validateFieldsDisabledTime(min, max);
          if (!validateTime) return validateTime;
          if (validateTime.min && validateTime.max) {
            return !(validateTime.min < currentDate && validateTime.max > currentDate);
          }
          return !(
            (validateTime.min && validateTime.min < currentDate) ||
            (validateTime.max && validateTime.max > currentDate)
          );
        }}
      />
    );
  }

  getTimeComponent = (initialValue, type) => {
    const { getFieldDecorator } = this.props.form;
    const fieldType = this.getFieldTypeText(type);
    return getFieldDecorator('default_value', {
      initialValue: initialValue || '',
      rules: [{
        validator: this.validateFiledsDefaultValue,
      }],
    })(
      <RadioTime
        type={type}
        fieldType={fieldType}
      />
    );
  }

  getDepartmentComponent = (initialValue, type) => {
    const selectType = this.getSelectDefaultValue(initialValue, type);
    if (selectType !== false) return selectType;
    const { getFieldDecorator } = this.props.form;
    const fieldType = this.getFieldTypeText(type);
    const multiple = this.getMultiple();
    return getFieldDecorator('default_value', {
      initialValue: initialValue || (multiple ? [] : {}),
      rules: [{
        validator: this.validateFiledsDefaultValue,
      }],
    })(
      <RadioDepartment
        type={type}
        valueType="object"
        multiple={multiple}
        fieldType={fieldType}
        onChange={this.handelRadioChange}
        dataSource={this.props.department}
        key={multiple ? 'multiple' : 'single'}
      />
    );
  }

  getStaffComponent = (initialValue, type) => {
    const selectType = this.getSelectDefaultValue(initialValue, type);
    if (selectType !== false) return selectType;

    const { getFieldDecorator } = this.props.form;
    const fieldType = this.getFieldTypeText(type);
    const multiple = this.getMultiple();
    return getFieldDecorator('default_value', {
      initialValue: initialValue || (multiple ? [] : {}),
      rules: [{
        validator: this.validateFiledsDefaultValue,
      }],
    })(
      <RadioStaff
        type={type}
        valueType="object"
        multiple={multiple}
        fieldType={fieldType}
        onChange={this.handelRadioChange}
      />
    );
  }

  getShopComponent = (initialValue, type) => {
    const selectType = this.getSelectDefaultValue(initialValue, type);
    if (selectType !== false) return selectType;

    const { getFieldDecorator } = this.props.form;
    const fieldType = this.getFieldTypeText(type);
    const multiple = this.getMultiple();
    return getFieldDecorator('default_value', {
      initialValue: initialValue || (multiple ? [] : {}),
      rules: [{
        validator: this.validateFiledsDefaultValue,
      }],
    })(
      <RadioShop
        type={type}
        valueType="object"
        multiple={multiple}
        fieldType={fieldType}
        onChange={this.handelRadioChange}
      />
    );
  }

  getSelectDefaultValue = (defaultValue, type) => {
    const { getFieldValue, getFieldDecorator } = this.props.form;
    const sourceData = getFieldValue('available_options');
    if (!sourceData || (!Object.keys(sourceData).length || !sourceData.length)) {
      return false;
    }
    const fieldType = this.getFieldTypeText(type);
    const multiple = this.getMultiple();
    return getFieldDecorator('default_value', {
      initialValue: defaultValue,
      rules: [{
        validator: this.validateFiledsDefaultValue,
      }],
    })(
      <RadioSelect
        type={type}
        valueType="object"
        multiple={multiple}
        fieldType={fieldType}
        sourceData={sourceData}
        onChange={this.handelRadioChange}
      />
    );
  }

  getTypeDefaultComponent = (type) => {
    const { initialValue } = this.props;
    const {
      getFieldValue,
      getFieldsValue,
      getFieldDecorator,
    } = this.props.form;
    const multiple = this.getMultiple();
    const value = initialValue.default_value || undefined;
    if (['date', 'datetime'].indexOf(type) !== -1) {
      return this.getDateComponent(value, type);
    } else if (type === 'time') {
      return this.getTimeComponent(value, type);
    } else if (type === 'select') {
      const { options } = getFieldsValue(['options']);
      const mode = multiple ? { mode: 'multiple' } : {};
      return getFieldDecorator('default_value', {
        initialValue: value || (multiple ? [] : ''),
        rules: [{
          validator: this.validateFiledsDefaultValue,
        }],
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
    } else if (type === 'array') {
      return getFieldDecorator('default_value', {
        initialValue: value || [],
        rules: [{
          validator: this.validateFiledsDefaultValue,
        }],
      })(
        <TagInput />
      );
    } else if (type === 'department') {
      return this.getDepartmentComponent(value, type);
    } else if (type === 'staff') {
      return this.getStaffComponent(value, type);
    } else if (type === 'shop') {
      return this.getShopComponent(value, type);
    } else if (type === 'region') {
      const defaultValue = value || {};
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
        rules: [{
          validator: this.validateFiledsDefaultValue,
        }],
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
        rules: [{
          validator: this.validateFiledsDefaultValue,
        }],
      })(
        <InputTags placeholder="请输入" fields={fields} />
      );
    } else {
      return this.getTypeDefaultComponent(type);
    }
  }


  labelValue = labelText;

  handelRadioChange = (_, isCheckBox) => {
    if (isCheckBox === 'radio') {
      this.handleDefaultValueChange({
        min: undefined,
        max: undefined,
        is_checkbox: false,
      });
    }
  }

  handleDefaultValueChange = (values = { default_value: undefined }) => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue(values);
  }

  handleOk = (value) => {
    const { initialValue, config: { onOk } } = this.props;
    const isCheckbox = value.is_checkbox ? 1 : 0;

    let defaultValue = value.default_value;
    const availableOptions = value.available_options || [];
    const optionsAble = defaultValue && availableOptions.length;
    if (Array.isArray(defaultValue) && optionsAble) {
      const availableOptionsValue = availableOptions.map(item => `${item.value}`);
      defaultValue = defaultValue.map((item) => {
        if (typeof item === 'object') {
          return item;
        } else {
          const optIndex = availableOptionsValue.indexOf(item);
          return availableOptions[optIndex] || item;
        }
      });
    } else if (typeof defaultValue === 'object' && optionsAble) {
      defaultValue = availableOptions.find(item => `${item.value}` === defaultValue.value) || value.default_value;
    } else if (typeof defaultValue === 'string' && optionsAble) {
      defaultValue = availableOptions.find(item => `${item.value}` === defaultValue) || defaultValue;
    } else if (!defaultValue && availableOptions.length) {
      defaultValue = value.is_checkbox ? [] : {};
    } else if (value.type === 'region' && !defaultValue) {
      defaultValue = {};
    }
    const params = {
      region_level: null,
      ...initialValue,
      ...value,
      is_checkbox: isCheckbox,
      available_options: value.available_options || [],
      default_value: defaultValue,
    };
    params.scale = params.scale || 0;
    Object.keys(params).forEach((key) => {
      if (params[key] === undefined) {
        params[key] = '';
      }
    });
    onOk(params);
  }

  fetchDepartment = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'department/fetchDepartment' });
  };

  makeFieldBlockCls = (fieldType) => {
    const { getFieldValue } = this.props.form;
    const multiple = getFieldValue('is_checkbox');
    const maxAndMinIndexOf = fieldMinAndMax.indexOf(fieldType);
    const maxAndMinCls = classNames({
      [styles.disblock]: maxAndMinIndexOf === -1 || (
        !multiple && maxAndMinIndexOf !== -1 && requiredCheckBox.indexOf(fieldType) === -1
      ),
    });
    const scaleCls = classNames({
      [styles.disblock]: fieldScale.indexOf(fieldType) === -1,
    });
    const optionsCls = classNames({
      [styles.disblock]: fieldOptions.indexOf(fieldType) === -1,
    });

    const isCheckboxCls = classNames({
      [styles.disblock]: fieldIsCheckbox.indexOf(fieldType) === -1,
    });
    const notDefaultValue = ['file'];
    const defaultCls = classNames({
      [styles.disblock]: !fieldType || notDefaultValue.indexOf(fieldType) !== -1,
    });
    const cardAble = (
      scaleCls.length &&
      optionsCls.length &&
      maxAndMinCls.length &&
      isCheckboxCls.length && defaultCls.length
    );
    const cardCls = classNames(styles.cardTitle, {
      [styles.disblock]: cardAble,
    });
    return {
      cardCls,
      scaleCls,
      defaultCls,
      optionsCls,
      maxAndMinCls,
      isCheckboxCls,
    };
  }

  validateFieldsDisabledTime = (min, max) => {
    const { getFieldValue } = this.props.form;
    const type = getFieldValue('type');
    let momentMin;
    let momentMax;
    let minIsValid = true;
    let maxIsValid = true;
    if (type === 'time') {
      const momentDay = moment().format('YYYY-MM-DD');
      momentMin = min ? moment(`${momentDay} ${min}`) : false;
      momentMax = max ? moment(`${momentDay} ${max}`) : false;
      minIsValid = momentMin ? momentMin.isValid() : false;
      maxIsValid = momentMax ? momentMax.isValid() : false;
    } else {
      momentMin = min ? moment(min) : false;
      momentMax = max ? moment(max) : false;
      minIsValid = momentMin ? momentMin.isValid() : false;
      maxIsValid = momentMax ? momentMax.isValid() : false;
    }
    if (
      max === '' && max === undefined &&
      min === '' && min === undefined &&
      !minIsValid && !maxIsValid) {
      return false;
    }
    return {
      min: momentMin,
      max: momentMax,
    };
  }

  validateFiledsMinAndMax = (_, __, cb) => {
    const { getFieldsValue, validateFields } = this.props.form;
    const { min, max, type } = getFieldsValue(['max', 'min', 'type']);
    if (min !== undefined && max !== undefined) {
      if (timePickerCom.indexOf(type) !== -1) {
        const momentMaxAndMin = this.validateFieldsDisabledTime(min, max);
        if (momentMaxAndMin) {
          if (min && max && min > max) {
            cb('最小值时间不能大于最大值时间');
          }
        }
      } else {
        validateFields(['default_value'], { force: true });
        if (min > max) {
          cb('最小值不能大于最大值');
        }
      }
    }
    cb();
  }

  validateFiledsScale = (_, __, cb) => {
    const { getFieldValue, validateFields } = this.props.form;
    const defaultValue = getFieldValue('default_value');
    if (defaultValue !== undefined && defaultValue !== '') {
      validateFields(['default_value'], { force: true });
    }
    cb();
  }

  validateFiledsDefaultValue = (_, value, cb) => {
    const { getFieldsValue, getFieldValue } = this.props.form;
    const minAndMaxAndType = getFieldsValue(['max', 'min', 'type']);
    const { type } = minAndMaxAndType;
    if (type === 'time' && value !== undefined && value !== '' && value !== null) {
      const momentMaxAndMin = this.validateFieldsDisabledTime(
        minAndMaxAndType.min, minAndMaxAndType.max
      );
      if (momentMaxAndMin) {
        const day = moment().format('YYYY-MM-DD');
        const valueMoment = moment(`${day} ${value}`);
        if (
          (momentMaxAndMin.min && momentMaxAndMin.min > valueMoment) ||
          (momentMaxAndMin.max && momentMaxAndMin.max < valueMoment)
        ) {
          cb('所选时间不在最小时间和最大时间范围');
        }
      }
    }
    if (value !== undefined && value !== '' && timePickerCom.indexOf(type) === -1) {
      const scale = getFieldValue('scale');
      const min = parseFloat(minAndMaxAndType.min);
      const max = parseFloat(minAndMaxAndType.max);
      const minAble = min !== undefined && min !== '';
      const maxAble = max !== undefined && max !== '';
      if (Array.isArray(value)) {
        if (minAble && value.length < min) {
          cb(`默认值的最小个数为${min}`);
        }
        if (maxAble && value.length > max) {
          cb(`默认值的最大个数为${max}`);
        }
      } else if (type === 'text') {
        if (minAble && value.length < min) {
          cb(`默认值的最小长度为${min}`);
        }
        if (maxAble && value.length > max) {
          cb(`默认值的最大长度为${max}`);
        }
      } else if (type === 'int') {
        if (minAble && parseFloat(value) < min) {
          cb(`默认值的最小值为${min}`);
        }
        if (maxAble && parseFloat(value) > max) {
          cb(`默认值的最大值为${max}`);
        }
        if (scale !== undefined && scale !== '') {
          const regArr = ['^(-|\\d)?[0-9]+\\.\\d', `{${scale}}`];
          const regStr = regArr.join('');
          const reg = new RegExp(regStr);
          if (!reg.test(value)) {
            cb(`默认值必须是一个小数位数为${scale}位的数字`);
          }
        }
      }
    }
    cb();
  }


  renderRegion = () => {
    const { labelValue } = this;
    const { initialValue, form: { getFieldDecorator } } = this.props;
    return (
      <FormItem label={labelValue.region_level} {...fieldsRowItemLayout}>
        {getFieldDecorator('region_level', {
          initialValue: `${initialValue.region_level || 4}`,
        })(
          <RadioGroup onChange={() => this.handleDefaultValueChange()}>
            <Radio value="4">省/市/区/详细地址</Radio>
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
      <FormItem label={labelValue.available_options} {...fieldsRowItemLayout}>
        {getFieldDecorator('available_options', {
          initialValue: initialValue.available_options || [],
        })(
          <TreeSelect
            multiple
            parentValue={0}
            valueIndex="value"
            dataSource={department}
            name={{ value: 'id', text: 'full_name' }}
            getPopupContainer={triggerNode => (triggerNode)}
            dropdownStyle={{ maxHeight: '300px', overflow: 'auto' }}
            onChange={() => this.handleDefaultValueChange()}
          />
        )}
      </FormItem>
    );
  }

  renderStaff = () => {
    const { labelValue } = this;
    const { initialValue, form: { getFieldDecorator } } = this.props;
    return (
      <FormItem label={labelValue.available_options} {...fieldsRowItemLayout}>
        {getFieldDecorator('available_options', {
          initialValue: initialValue.available_options || [],
        })(
          <SearchTable.Staff
            multiple
            showName="text"
            placeholder="请选择"
            name={{ value: 'staff_sn', text: 'realname' }}
            onChange={() => this.handleDefaultValueChange()}
          />
        )}
      </FormItem>
    );
  }

  renderShop = () => {
    const { labelValue } = this;
    const { initialValue, form: { getFieldDecorator } } = this.props;
    return (
      <FormItem label={labelValue.available_options} {...fieldsRowItemLayout}>
        {getFieldDecorator('available_options', {
          initialValue: initialValue.available_options || [],
        })(
          <SearchTable.Shop
            multiple
            showName="text"
            placeholder="请选择"
            name={{
              value: 'shop_sn',
              text: 'name',
            }}
            onChange={() => this.handleDefaultValueChange()}
          />
        )}
      </FormItem>
    );
  }

  renderStaffCondition = () => {
    const { initialValue, form: { getFieldDecorator } } = this.props;
    const { labelValue } = this;
    return (
      <FormItem label={labelValue.condition} {...fieldsRowItemLayout}>
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
    let extarRender;
    switch (typeValue) {
      case 'region':
        render = this.renderRegion();
        break;
      case 'department':
        render = this.renderDepartment();
        break;
      case 'staff':
        render = this.renderStaff();
        extarRender = (
          <Col span={24} key="renderStaffCondition">
            {this.renderStaffCondition()}
          </Col>
        );
        break;
      case 'shop':
        render = this.renderShop();
        break;
      default:
        break;
    }
    render = (
      <Col span={24} key="renderTypeComponent">
        {render}
      </Col>
    );
    return [render, extarRender] || null;
  }

  renderMinAndMax = (maxAndMinCls) => {
    const { initialValue } = this.props;
    const { getFieldValue, getFieldDecorator } = this.props.form;
    const { labelValue } = this;
    const typeValue = getFieldValue('type');
    const format = typeValue === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss';
    return (
      <React.Fragment>
        <Col {...fieldsBoxLayout} className={maxAndMinCls}>
          <FormItem label={labelValue.min} {...fieldsItemLayout}>
            {
              getFieldDecorator('min', {
                initialValue: initialValue.min || '',
                rules: [{
                  validator: this.validateFiledsMinAndMax,
                }],
              })(
                (typeValue === 'date' || typeValue === 'datetime') ? (
                  <DatePicker format={format} showTime={typeValue !== 'date'} />
                ) : typeValue === 'time' ?
                    (
                      <TimePicker />
                    ) :
                    (
                      <Input placeholder="请输入" min={0} style={{ width: '100%' }} />
                    )
              )
            }
          </FormItem>
        </Col>
        <Col {...fieldsBoxLayout} className={maxAndMinCls}>
          <FormItem label={labelValue.max} {...fieldsItemLayout}>
            {
              getFieldDecorator('max', {
                initialValue: initialValue.max || '',
                rules: [{
                  validator: this.validateFiledsMinAndMax,
                }],
              })(
                (typeValue === 'date' || typeValue === 'datetime') ? (
                  <DatePicker format={format} showTime={typeValue !== 'date'} />
                ) : typeValue === 'time' ?
                    (
                      <TimePicker />
                    ) :
                    (
                      <Input placeholder="请输入" min={0} style={{ width: '100%' }} />
                    )
              )
            }
          </FormItem>
        </Col>
      </React.Fragment>
    );
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
    let validatorData = [...validator];
    if (fieldType === 'file') {
      validatorData = validator.filter(item => item.type === 'mimes');
    } else {
      validatorData = validator.filter(item => item.type !== 'mimes');
    }

    const {
      cardCls,
      scaleCls,
      defaultCls,
      optionsCls,
      maxAndMinCls,
      isCheckboxCls,
    } = this.makeFieldBlockCls(fieldType);
    return (
      <OAModal
        width={800}
        {...modalProps}
        onSubmit={validateFields(this.handleOk)}
      >
        <Card className={styles.cardTitle} title="控件信息" bordered={false}>
          <Row>
            <Col {...fieldsBoxLayout}>
              <FormItem label={labelValue.name} {...fieldsItemLayout} required>
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
              <FormItem label={labelValue.key} {...fieldsItemLayout} required>
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
              <FormItem label={labelValue.type} {...fieldsItemLayout} required>
                {
                  getFieldDecorator('type', {
                    initialValue: initialValue.type || undefined,
                    rules: [validatorRequired],
                  })(
                    <Select
                      placeholder="请选择"
                      style={{ width: '100%' }}
                      getPopupContainer={triggerNode => (triggerNode)}
                      onChange={() => {
                        this.handleDefaultValueChange(resetFields);
                      }}
                    >
                      {fieldsTypes.map(item => (
                        <Option key={item.value} value={item.value}>{item.text}</Option>
                      ))}
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
                        validatorData.map(item => (
                          <Option key={item.id} value={item.id}>{item.name}</Option>
                        ))
                      }
                    </Select>
                  )
                }
              </FormItem>
            </Col>
          </Row>
        </Card>
        <Card title="控件配置" className={cardCls} bordered={false}>
          <Row>
            <Col span={24} className={optionsCls}>
              <FormItem label={labelValue.options} {...fieldsRowItemLayout}>
                {
                  getFieldDecorator('options', {
                    initialValue: initialValue.options || [],
                  })(
                    <TagInput name="options" />
                  )
                }
              </FormItem>
            </Col>
            <Col span={24} className={isCheckboxCls}>
              <FormItem label={labelValue.is_checkbox} {...fieldsRowItemLayout} >
                {
                  getFieldDecorator('is_checkbox', {
                    initialValue: initialValue.is_checkbox === 1 || false,
                    valuePropName: 'checked',
                  })(
                    <Switch onChange={() => this.handleDefaultValueChange({
                      max: undefined,
                      min: undefined,
                      default_value: undefined,
                    })}
                    />
                  )
                }
              </FormItem>
            </Col>
            {this.renderMinAndMax(maxAndMinCls)}
            <Col {...fieldsBoxLayout} className={scaleCls}>
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
            {this.renderTypeComponent()}
            <Col span={24} className={defaultCls}>
              <FormItem label={labelValue.default_value} {...fieldsRowItemLayout}>
                {this.getDefaultComponent(fields, fieldType)}
              </FormItem>
            </Col>
          </Row>
        </Card>
      </OAModal>
    );
  }
}
