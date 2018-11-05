import React from 'react';
import {
  Col,
  Row,
  Input,
  Select,
  Button,
  Radio,
} from 'antd';
import moment from 'moment';
import store from './store/store';
import OAForm, {
  Address,
  DatePicker,
  SearchTable,
} from '../../../components/OAForm';
import { nation } from '../../../assets/nation';
import { province } from '../../../assets/province';
import { customerStatus } from '../../../assets/customer';
import UploadCropper from '../../../components/UploadCropper';

const RadioGroup = Radio.Group;
const FormItem = OAForm.Item;
const { Option, OptGroup } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};

const rowFormItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 12,
    },
  },
};

const rowGutter = { sm: 16, lg: 8 };
const colSpan = { sm: rowGutter.sm / 2, lg: rowGutter.lg / 2 };

export const sexOption = [
  { label: '男', value: '男' },
  { label: '女', value: '女' },
];

@store(['submit', 'fetchDataSource', 'fetchLevel'])
@OAForm.create()
export default class extends React.PureComponent {
  componentDidMount() {
    const { fetchDataSource, match, fetchLevel } = this.props;
    const { id } = match.params;
    if (id) { this.id = id; fetchDataSource({ id }); }
    fetchLevel();
  }

  handleSubmit = (values, onError) => {
    const { submit } = this.props;
    const params = { ...values };
    if (this.id) params.id = this.id;
    submit({ ...params, shops: [] }, onError);
  }

  render() {
    const {
      tags,
      level,
      source,
      brands,
      tagsType,
      staffBrandsAuth,
      validateFields, validatorRequired,
      form: {
        getFieldDecorator, setFieldsValue, getFieldsValue, getFieldValue,
      },
    } = this.props;
    let tagsGroup = [];
    const tagsTypeId = tagsType.map(type => type.id);
    const tagsGroupAble = tags.filter(tag => tagsTypeId.indexOf(tag.type_id) === -1);
    tagsType.forEach((type) => {
      const temp = { ...type };
      temp.children = [];
      tags.forEach((tag) => {
        if (tag.type_id === type.id) {
          temp.children.push(tag);
        }
      });
      if (temp.children.length) tagsGroup.push(temp);
    });
    tagsGroup = tagsGroup.concat(tagsGroupAble);
    const { details } = this.props;
    let initialValue = {};
    let brandValue;
    let nameDisabled = false;
    const iconImage = {
      img: '',
      thumb: '',
    };
    if (details[this.id]) {
      initialValue = details[this.id];
      nameDisabled = (moment().unix() - moment(initialValue.created_at).unix()) > 7 * 86400;
      brandValue = initialValue.brands.map(item => `${item.brand_id}`);
      const { icon } = initialValue;
      ([iconImage.img, iconImage.thumb] = icon || []);
    }
    const { editable = [] } = staffBrandsAuth;
    const staffBransData = brands.filter(item => editable.indexOf(item.id) !== -1);
    const images = getFieldsValue(['icon', 'id_card_image_b', 'id_card_image_f']);
    const required = !(getFieldValue('status') === '0');
    return (
      <OAForm onSubmit={validateFields(this.handleSubmit)}>
        <Row gutter={rowGutter}>
          <Col {...colSpan}>
            <FormItem label="客户姓名" {...formItemLayout} required>
              {getFieldDecorator('name', {
                initialValue: initialValue.name || '',
                rules: [validatorRequired],
              })(
                <Input placeholder="请输入" disabled={nameDisabled} />
              )}
            </FormItem>
          </Col>
          <Col {...colSpan}>
            <FormItem label="性别" {...formItemLayout} required>
              {getFieldDecorator('gender', {
                initialValue: initialValue.gender || '男',
                rules: [validatorRequired],
              })(
                <RadioGroup>
                  {sexOption.map(item =>
                    (<Radio key={item.value} value={item.value}>{item.label}</Radio>))
                  }
                </RadioGroup>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={rowGutter}>
          <Col {...colSpan}>
            <FormItem label="客户头像" {...formItemLayout}>
              {getFieldDecorator('icon', {
                initialValue: iconImage.img,
              })(
                <Input type="hidden" />
              )}
              <UploadCropper
                name="iconImage"
                cropperProps={{
                  aspectRatio: 1,
                }}
                value={images.icon ? [images.icon] : []}
                actionType="customer/avatar"
                onChange={(values) => {
                  setFieldsValue({ icon: values[0] });
                }}
              />
            </FormItem>
          </Col>
          <Col {...rowGutter}>
            <FormItem label="预览" {...rowFormItemLayout}>
              {images.icon && (<img src={images.icon} alt="头像" width="96" height="96" style={{ borderRadius: '50%' }} />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={rowGutter}>
          <Col {...rowGutter}>
            <FormItem label="合作品牌" {...rowFormItemLayout} required>
              {getFieldDecorator('brands', {
                initialValue: brandValue || [],
                // ...required && { rules: [validatorRequired] },
              })(
                <Select placeholder="请选择" mode="multiple">
                  {staffBransData.map(item =>
                    (<Option key={`${item.id}`}>{item.name}</Option>))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={rowGutter}>
          <Col {...rowGutter}>
            <FormItem label="客户等级" {...rowFormItemLayout} required={required}>
              {getFieldDecorator('levels', {
                initialValue: (initialValue.levels || []).map(item => `${item.level_id}`),
                ...required && { rules: [validatorRequired] },
              })(
                <Select placeholder="请选择" mode="multiple">
                  {level.map(item =>
                    (<Option key={`${item.id}`}>{item.name}</Option>))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={rowGutter}>
          <Col {...colSpan}>
            <FormItem label="客户状态" {...formItemLayout} required>
              {getFieldDecorator('status', {
                initialValue: initialValue.status !== undefined ? `${initialValue.status}` : undefined,
                rules: [validatorRequired],
              })(
                <Select placeholder="请选择">
                  {customerStatus.map(item =>
                    (<Option key={`${item.id}`}>{item.name}</Option>))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col {...colSpan}>
            <FormItem label="初次合作时间" {...formItemLayout}>
              {getFieldDecorator('first_cooperation_at', {
                initialValue: initialValue.first_cooperation_at || '',
              })(
                <DatePicker placeholder="请输入" style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
        </Row>

        <Row gutter={rowGutter}>
          <Col {...rowGutter}>
            <FormItem label="合作省份" {...rowFormItemLayout} required={required}>
              {getFieldDecorator('linkages', {
                initialValue: (initialValue.linkages || []).map(item => `${item.linkage_id}`),
                ...required && { rules: [validatorRequired] },
              })(
                <Select placeholder="请选择" mode="multiple">
                  {province.map(item =>
                    (<Option key={`${item.id}`}>{item.name}</Option>))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row gutter={rowGutter}>
          <Col {...rowGutter}>
            <FormItem label="身份证号码" {...rowFormItemLayout} required={required}>
              {getFieldDecorator('id_card_number', {
                initialValue: initialValue.id_card_number || '',
                ...required && { rules: [validatorRequired] },
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={rowGutter}>
          <Col {...colSpan}>
            <FormItem label="身份证照片" {...formItemLayout}>
              {getFieldDecorator('id_card_image_f', {
                initialValue: initialValue.id_card_image_f,
              })(
                <Input type="hidden" />
              )}
              <UploadCropper
                name="cardImage"
                placeholder="上传正面"
                actionType="customer/card"
                value={images.id_card_image_f ? [images.id_card_image_f] : []}
                onChange={(values) => {
                  setFieldsValue({ id_card_image_f: values[0] });
                }}
              />
            </FormItem>
          </Col>
          <Col {...colSpan}>
            <FormItem {...formItemLayout}>
              {getFieldDecorator('id_card_image_b', {
                initialValue: initialValue.id_card_image_b,
              })(
                <Input type="hidden" />
              )}
              <UploadCropper
                name="cardImage"
                placeholder="上传反面"
                actionType="customer/card"
                value={images.id_card_image_b ? [images.id_card_image_b] : []}
                onChange={(values) => {
                  setFieldsValue({ id_card_image_b: values[0] });
                }}
              />
            </FormItem>
          </Col>
        </Row>
        <Row gutter={rowGutter}>
          <Col {...rowGutter}>
            <FormItem label="电话" {...rowFormItemLayout} required>
              {getFieldDecorator('mobile', {
                initialValue: initialValue.mobile || '',
                rules: [validatorRequired],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>

        <Row gutter={rowGutter}>
          <Col {...rowGutter}>
            <FormItem label="微信" {...rowFormItemLayout}>
              {getFieldDecorator('wechat', {
                initialValue: initialValue.wechat || '',
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>


        <Row gutter={rowGutter}>
          <Col {...rowGutter}>
            <FormItem label="现住地址" {...rowFormItemLayout}>
              {getFieldDecorator('present_address', {
                initialValue: {
                  address: initialValue.address || '',
                  city_id: initialValue.city_id || '',
                  county_id: initialValue.county_id || '',
                  province_id: initialValue.province_id || '',
                },
              })(
                <Address />
              )}
            </FormItem>
          </Col>
        </Row>


        <Row gutter={rowGutter}>
          <Col {...rowGutter}>
            <FormItem label="客户来源" {...rowFormItemLayout} required={required}>
              {getFieldDecorator('source_id', {
                initialValue: initialValue.source_id ? `${initialValue.source_id}` : undefined,
                ...required && { rules: [validatorRequired] },
              })(
                <Select placeholder="请选择">
                  {source.map(item =>
                    (<Option key={`${item.id}`}>{item.name}</Option>))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={rowGutter}>
          <Col {...rowGutter}>
            <FormItem label="介绍人" {...rowFormItemLayout}>
              {getFieldDecorator('recommend', {
                initialValue: {
                  recommend_id: initialValue.recommend_id || '',
                  recommend_name: initialValue.recommend_name || '',
                },
              })(
                <SearchTable.Customer
                  name={{
                    recommend_id: 'id',
                    recommend_name: 'name',
                  }}
                  valueName="recommend_id"
                  showName="recommend_name"
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={rowGutter}>
          <Col {...rowGutter}>
            <FormItem label="拓展员工" {...rowFormItemLayout}>
              {getFieldDecorator('developer', {
                initialValue: {
                  develop_sn: initialValue.develop_sn || '',
                  develop_name: initialValue.develop_name || '',
                },
              })(
                <SearchTable.Staff
                  name={{
                    develop_sn: 'staff_sn',
                    develop_name: 'realname',
                  }}
                  valueName="develop_sn"
                  showName="develop_name"
                />
              )}
            </FormItem>
          </Col>
        </Row>

        <Row gutter={rowGutter}>
          <Col {...colSpan}>
            <FormItem label="民族" {...formItemLayout} >
              {getFieldDecorator('nation', {
                initialValue: initialValue.nation || undefined,
              })(
                <Select placeholder="请选择">
                  {nation.map(item =>
                    (<Option key={item.name}>{item.name}</Option>))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col {...colSpan}>
            <FormItem label="籍贯" {...formItemLayout} >
              {getFieldDecorator('native_place', {
                initialValue: initialValue.native_place || undefined,
              })(
                <Select placeholder="请选择">
                  {province.map(item =>
                    (<Option key={`${item.name}`}>{item.name}</Option>))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={rowGutter}>
          <Col {...rowGutter}>
            <FormItem label="标签" {...rowFormItemLayout}>
              {getFieldDecorator('tags', {
                initialValue: initialValue.tags ? initialValue.tags.map(item => `${item.tag_id}`) : [],
              })(
                <Select
                  mode="multiple"
                  placeholder="请选择"
                >
                  {tagsGroup.map((item) => {
                    return item.children ? (
                      <OptGroup key={`${item.id}`} label={item.name}>
                        {item.children.map(tag => (<Option key={`${tag.id}`} value={`${tag.id}`}>{tag.name}</Option>))}
                      </OptGroup>
                    ) :
                      (
                        <Option key={`${item.id}`}>{item.name}</Option>
                      );
                  })
                  }
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={rowGutter}>
          <Col {...rowGutter}>
            <FormItem label="备注" {...rowFormItemLayout}>
              {getFieldDecorator('remark', {
                initialValue: initialValue.remark || '',
              })(
                <Input.TextArea placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={rowGutter}>
          <Col {...rowGutter}>
            <FormItem label="维护人" {...rowFormItemLayout}>
              {getFieldDecorator('vindicator', {
                initialValue:
                  initialValue.vindicator_sn ? {
                    staff_sn: initialValue.vindicator_sn,
                    staff_name: initialValue.vindicator_name,
                  } : {},
              })(
                <SearchTable.Staff />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={rowGutter}>
          <Col {...colSpan}>
            <FormItem {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit" style={{ width: 150 }}>保存</Button>
            </FormItem>
          </Col>
        </Row>
      </OAForm>
    );
  }
}
