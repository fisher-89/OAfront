import React, { PureComponent } from 'react';
import { connect } from 'dva';

import {
  Row,
  Col,
  Card,
  Tabs,
  Input,
  Radio,
  Select,
  Switch,
} from 'antd';
import OAForm, { SearchTable, Address, DatePicker, OAModal } from '../../../components/OAForm';
import RelativeList from './relativeList';

const FormItem = OAForm.Item;

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

@connect(({ staffs, loading }) => ({
  staffInfo: staffs.staffDetails,
  staffLoading: loading.models.staffs,
  fetching: loading.effects['staffs/fetchStaff'],
}))

@OAForm.create()
export default class EditStaff extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      initialValue: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    const { staffInfo, staffSn } = nextProps;
    if (staffSn && staffSn !== this.props.staffSn) {
      this.fetchInfo(staffSn);
    }
    const { initialValue } = this.state;
    if (JSON.stringify(staffInfo[staffSn]) !== JSON.stringify(initialValue) && staffInfo[staffSn]) {
      this.setState({ initialValue: staffInfo[staffSn] });
    }
  }

  onFilter = (inputValue, path) => {
    const result = path.some((option) => {
      return option
        .label
        .toLowerCase()
        .indexOf(inputValue.toLowerCase()) > -1;
    });
    return result;
  };

  onChange = (value, key) => {
    this.setState({ [key]: value });
  };

  fetchInfo = (staffSn) => {
    const { dispatch } = this.props;
    const isEdit = staffSn !== undefined;
    if (isEdit) {
      dispatch({
        type: 'staffs/fetchStaffInfo',
        payload: {
          staff_sn: staffSn,
        },
      });
    }
  };

  handleSubmit = (params) => {
    const { dispatch } = this.props;
    const response = { ...params };
    dispatch({
      type: 'staffs/editStaff',
      payload: response,
      onError: this.handleError,
      onSuccess: this.handleSuccess,
    });
  };

  handleError = (err) => {
    const { onError } = this.props;
    onError(err);
  };

  handleSuccess = () => {
    this.handleModalVisible(false);
  };

  handleSelectFilter = (input, option) => {
    return (option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0);
  };

  makeDecoratorValue = () => {
    const { form: { getFieldDecorator } } = this.props;
    const { initialValue } = this.state;
    const registerForm = [
      'living_city_id',
      'living_province_id',
      'living_county_id',
      'living_address',
      'recruiter_sn',
      'recruiter_name',
      'household_city_id',
      'household_county_id',
      'household_address',
    ];
    registerForm.forEach((item) => {
      getFieldDecorator(item, { initialValue: initialValue[item] });
    });
  }

  handleLocal = () => {
    const {
      autoSave: { getLocal },
      form: { setFieldsValue },
    } = this.props;
    const fieldsValue = getLocal();
    // console.log(getFieldsValue());
    setFieldsValue(fieldsValue);
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 6,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 12,
        },
      },
    };

    const formItemLayout2 = {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 12,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 12,
        },
      },
    };
    const fieldsBoxLayout = {
      xs: 24,
      lg: 12,
    };
    const formItemLayout3 = {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 9,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 12,
        },
      },
    };
    const formItemLayout4 = {
      labelCol: {
        sm: {
          span: 4,
        },
      },
      wrapperCol: {
        sm: {
          span: 20,
        },
      },
    };
    const {
      form,
      validateFields,
      staffLoading,
      visible,
      form: { getFieldDecorator, setFieldsValue },
    } = this.props;
    const { initialValue } = this.state;
    this.makeDecoratorValue();
    return (
      <OAModal
        width={600}
        title="员工表单"
        visible={visible}
        style={{ top: 30 }}
        loading={staffLoading}
        onCancel={() => this.props.onCancel()}
        onSubmit={validateFields(this.handleSubmit)}
      >
        <Card>
          <Tabs defaultActiveKey="1">
            <TabPane forceRender tab="基础资料" key="1" >
              <Row>
                <Col {...fieldsBoxLayout}>
                  {initialValue.staff_sn
                  ? getFieldDecorator('staff_sn', {
                      initialValue: initialValue.staff_sn,
                    })(<Input type="hidden" />)
                  : null}
                  <FormItem {...formItemLayout2} label="员工姓名" required>
                    {getFieldDecorator('realname', {
                      initialValue: initialValue.realname || '',
                    })(
                      <Input placeholder="请输入员工姓名" />
                    )}
                  </FormItem>
                </Col>
                <Col {...fieldsBoxLayout}>
                  <FormItem {...formItemLayout3} label="性别" required>
                    {getFieldDecorator('gender_id', {
                      initialValue: initialValue.gender_id || '',
                    })(
                      <RadioGroup>
                        <RadioButton value={1}>男</RadioButton>
                        <RadioButton value={2}>女</RadioButton>
                      </RadioGroup>
                    )}
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <Col {...fieldsBoxLayout}>
                  <FormItem {...formItemLayout2} label="电话号码" required>
                    {getFieldDecorator('mobile', {
                      initialValue: initialValue.mobile || '',
                    })(
                      <Input placeholder="请输入电话号码" />
                    )}
                  </FormItem>
                </Col>
                <Col {...fieldsBoxLayout}>
                  <FormItem
                    {...formItemLayout3}
                    label="身份证号"
                    required
                  >
                    {getFieldDecorator('id_card_number', {
                      initialValue: initialValue.id_card_number || '',
                    })(
                      <Input placeholder="请输入身份证号" />
                    )}
                  </FormItem>
                </Col>
              </Row>

              <FormItem {...formItemLayout} label="员工备注" name="remark">
                {getFieldDecorator('remark', {
                  initialValue: initialValue.remark || '',
                })(
                  <TextArea
                    autosize={{
                      minRows: 2,
                      maxRows: 6,
                    }}
                    placeholder="最大长度100字符"
                  />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="操作说明" name="operation_remark">
                {getFieldDecorator('operation_remark', {
                  initialValue: initialValue.operation_remark || '',
                })(
                  <TextArea
                    autosize={{
                      minRows: 2,
                      maxRows: 6,
                    }}
                    placeholder="最大长度100字符"
                  />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="是否激活" name="is_active">
                {getFieldDecorator('is_active', {
                  initialValue: initialValue.is_active === 1,
                  valuePropName: 'checked',
                })(
                  <Switch
                    onChange={(value) => {
                      setFieldsValue({ is_active: value ? 1 : 0 });
                    }}
                  />
                )}
              </FormItem>
            </TabPane>

            <TabPane forceRender tab="个人信息" key="2">
              <Row>
                <Col {...fieldsBoxLayout}>
                  <FormItem {...formItemLayout2} label="银行卡号" >
                    {getFieldDecorator('account_number', {
                      initialValue: initialValue.account_number || '',
                    })(
                      <Input placeholder="请输入银行卡号" />
                    )}
                  </FormItem>
                </Col>
                <Col {...fieldsBoxLayout}>
                  <FormItem {...formItemLayout3} label="开户行" name="account_bank">
                    {getFieldDecorator('account_bank', {
                      initialValue: initialValue.account_bank || '',
                    })(
                      <Input placeholder="如：中国农业银行成都荷花池支行" />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col {...fieldsBoxLayout}>
                  <FormItem {...formItemLayout2} label="开户人" name="account_name">
                    {getFieldDecorator('account_name', {
                      initialValue: initialValue.account_name || '',
                    })(
                      <Input placeholder="请输入开户人" />
                    )}
                  </FormItem>
                </Col>
                <Col {...fieldsBoxLayout}>
                  <FormItem {...formItemLayout3} label="使用工资卡" name="account_active">
                    {getFieldDecorator('account_active', {
                      initialValue: initialValue.account_active === 1,
                      valuePropName: 'checked',
                    })(
                      <Switch
                        onChange={(value) => {
                          setFieldsValue({ account_active: value ? 1 : 0 });
                        }}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <Col {...fieldsBoxLayout}>
                  <FormItem {...formItemLayout2} label="紧急联系人" >
                    {getFieldDecorator('concat_name', {
                      initialValue: initialValue.concat_name || '',
                    })(
                      <Input placeholder="请输入紧急联系人" />
                    )}
                  </FormItem>
                </Col>
                <Col {...fieldsBoxLayout}>
                  <FormItem {...formItemLayout3} label="联系人电话" >
                    {getFieldDecorator('concat_tel', {
                      initialValue: initialValue.concat_tel || '',
                    })(
                      <Input placeholder="请输入联系人电话" />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col {...fieldsBoxLayout}>
                  <FormItem {...formItemLayout2} label="联系人类型" >
                    {getFieldDecorator('concat_type', {
                      initialValue: initialValue.concat_type || '',
                    })(
                      <Input placeholder="请输入联系人类型" />
                    )}
                  </FormItem>
                </Col>
                <Col {...fieldsBoxLayout}>
                  <FormItem {...formItemLayout3} label="电子邮箱">
                    {getFieldDecorator('email', {
                      initialValue: initialValue.email || '',
                    })(
                      <Input placeholder="请输入电子邮箱" />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col {...fieldsBoxLayout}>
                  <FormItem {...formItemLayout2} label="QQ号">
                    {getFieldDecorator('qq_number', {
                      initialValue: initialValue.qq_number || '',
                    })(
                      <Input placeholder="请输入QQ号" />
                    )}
                  </FormItem>
                </Col>
                <Col {...fieldsBoxLayout}>
                  <FormItem {...formItemLayout3} label="微信号" >
                    {getFieldDecorator('wechat_number', {
                      initialValue: initialValue.wechat_number || '',
                    })(
                      <Input placeholder="请输入微信号" />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <FormItem {...formItemLayout} label="招聘人员">
                <SearchTable.Staff
                  name={{
                    recruiter_sn: 'staff_sn',
                    recruiter_name: 'realname',
                  }}
                  showName="realname"
                  value={initialValue.recruiter_sn ? {
                    staff_sn: initialValue.recruiter_sn,
                    realname: initialValue.recruiter_name,
                  } : {}}

                  onChange={(value) => {
                    form.setFieldsValue(value);
                  }}
                />
              </FormItem>
              <FormItem {...formItemLayout} label="户口所在地">
                <Address
                  name={{
                    household_city_id: 'city_id',
                    household_province_id: 'province_id',
                    household_county_id: 'county_id',
                    household_address: 'address',
                  }}
                  value={{
                    city_id: initialValue.household_city_id || null,
                    province_id: initialValue.household_province_id || null,
                    county_id: initialValue.household_county_id || null,
                    address: initialValue.household_address || null,
                  }}
                  onChange={(value) => {
                    form.setFieldsValue(value);
                  }}
                />
              </FormItem>
              <FormItem {...formItemLayout} label="现居住地">
                <Address
                  name={{
                    living_city_id: 'city_id',
                    living_province_id: 'province_id',
                    living_county_id: 'county_id',
                    living_address: 'address',
                  }}
                  value={{
                    city_id: initialValue.living_city_id || null,
                    province_id: initialValue.living_province_id || null,
                    county_id: initialValue.living_county_id || null,
                    address: initialValue.living_address || null,
                  }}
                  onChange={(value) => {
                    form.setFieldsValue(value);
                  }}
                />
              </FormItem>
              <Row>
                <Col {...fieldsBoxLayout}>
                  <FormItem {...formItemLayout2} label="生日">
                    {getFieldDecorator('birthday', initialValue.birthday ? {
                      initialValue: initialValue.birthday,
                    } : {})(
                      <DatePicker
                        style={{
                          width: '100%',
                        }}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col {...fieldsBoxLayout}>
                  <FormItem {...formItemLayout3} label="民族">
                    {getFieldDecorator('national', initialValue ? {
                      initialValue: initialValue.national,
                    } : {})(
                      <Select
                        showSearch
                        placeholder="请选择民族"
                        optionFilterProp="children"
                        filterOption={this.handleSelectFilter}
                      >
                        <Option value="未知">未知</Option>
                        <Option value="汉族">汉族</Option>
                        <Option value="蒙古族">蒙古族</Option>
                        <Option value="满族">满族</Option>
                        <Option value="朝鲜族">朝鲜族</Option>
                        <Option value="赫哲族">赫哲族</Option>
                        <Option value="达斡尔族">达斡尔族</Option>
                        <Option value="鄂温克族">鄂温克族</Option>
                        <Option value="鄂伦春族">鄂伦春族</Option>
                        <Option value="回族">回族</Option>
                        <Option value="东乡族">东乡族</Option>
                        <Option value="土族">土族</Option>
                        <Option value="撒拉族">撒拉族</Option>
                        <Option value="保安族">保安族</Option>
                        <Option value="裕固族">裕固族</Option>
                        <Option value="维吾尔族">维吾尔族</Option>
                        <Option value="哈萨克族">哈萨克族</Option>
                        <Option value="柯尔克孜族">柯尔克孜族</Option>
                        <Option value="锡伯族">锡伯族</Option>
                        <Option value="塔吉克族">塔吉克族</Option>
                        <Option value="乌孜别克族">乌孜别克族</Option>
                        <Option value="俄罗斯族">俄罗斯族</Option>
                        <Option value="塔塔尔族">塔塔尔族</Option>
                        <Option value="藏族">藏族</Option>
                        <Option value="门巴族">门巴族</Option>
                        <Option value="珞巴族">珞巴族</Option>
                        <Option value="羌族">羌族</Option>
                        <Option value="彝族">彝族</Option>
                        <Option value="白族">白族</Option>
                        <Option value="哈尼族">哈尼族</Option>
                        <Option value="傣族">傣族</Option>
                        <Option value="傈僳族">傈僳族</Option>
                        <Option value="佤族">佤族</Option>
                        <Option value="拉祜族">拉祜族</Option>
                        <Option value="纳西族">纳西族</Option>
                        <Option value="景颇族">景颇族</Option>
                        <Option value="布朗族">布朗族</Option>
                        <Option value="阿昌族">阿昌族</Option>
                        <Option value="普米族">普米族</Option>
                        <Option value="怒族">怒族</Option>
                        <Option value="德昂族">德昂族</Option>
                        <Option value="独龙族">独龙族</Option>
                        <Option value="基诺族">基诺族</Option>
                        <Option value="苗族">苗族</Option>
                        <Option value="布依族">布依族</Option>
                        <Option value="侗族">侗族</Option>
                        <Option value="穿青族">穿青族</Option>
                        <Option value="仡佬族">仡佬族</Option>
                        <Option value="壮族">壮族</Option>
                        <Option value="瑶族">瑶族</Option>
                        <Option value="仫佬族">仫佬族</Option>
                        <Option value="毛南族">毛南族</Option>
                        <Option value="京族">京族</Option>
                        <Option value="土家族">土家族</Option>
                        <Option value="黎族">黎族</Option>
                        <Option value="畲族">畲族</Option>
                        <Option value="高山族">高山族</Option>
                        <Option value="革家族">革家族</Option>
                        <Option value="水族">水族</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col {...fieldsBoxLayout}>
                  <FormItem {...formItemLayout2} label="学历" >
                    {getFieldDecorator('education', initialValue.education ? {
                      initialValue: initialValue.education,
                    } : {})(
                      <Select
                        showSearch
                        placeholder="请选择学历"
                        optionFilterProp="children"
                        filterOption={this.handleSelectFilter}
                      >
                        <Option value="未知">未知</Option>
                        <Option value="小学">小学</Option>
                        <Option value="初中">初中</Option>
                        <Option value="高中">高中</Option>
                        <Option value="技校">技校</Option>
                        <Option value="职高">职高</Option>
                        <Option value="专科">专科</Option>
                        <Option value="本科">本科</Option>
                        <Option value="硕士">硕士</Option>
                        <Option value="博士">博士</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col {...fieldsBoxLayout}>
                  <FormItem {...formItemLayout3} label="政治面貌" >
                    {getFieldDecorator('politics', initialValue.politics ? {
                      initialValue: initialValue.politics,
                    } : {})(
                      <Select
                        showSearch
                        placeholder="请选择政治面貌"
                        optionFilterProp="children"
                        filterOption={this.handleSelectFilter}
                      >
                        <Option value="未知">未知</Option>
                        <Option value="群众">群众</Option>
                        <Option value="中共党员">中共党员</Option>
                        <Option value="中共预备党员">中共预备党员</Option>
                        <Option value="共青团员">共青团员</Option>
                        <Option value="民革党员">民革党员</Option>
                        <Option value="民盟盟员">民盟盟员</Option>
                        <Option value="民建会员">民建会员</Option>
                        <Option value="民进会员">民进会员</Option>
                        <Option value="农工党党员">农工党党员</Option>
                        <Option value="致公党党员">致公党党员</Option>
                        <Option value="九三学社社员">九三学社社员</Option>
                        <Option value="台盟盟员">台盟盟员</Option>
                        <Option value="无党派人士">无党派人士</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col {...fieldsBoxLayout}>
                  <FormItem {...formItemLayout2} label="婚姻状况" >
                    {getFieldDecorator('marital_status', initialValue.marital_status ? {
                      initialValue: initialValue.marital_status,
                    } : {})(
                      <Select
                        showSearch
                        placeholder="请选择婚姻状况"
                        optionFilterProp="children"
                        filterOption={this.handleSelectFilter}
                      >
                        <Option value="未知">未知</Option>
                        <Option value="未婚">未婚</Option>
                        <Option value="已婚">已婚</Option>
                        <Option value="离异">离异</Option>
                        <Option value="再婚">再婚</Option>
                        <Option value="丧偶">丧偶</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col {...fieldsBoxLayout}>
                  <FormItem {...formItemLayout3} label="员工属性" >
                    {getFieldDecorator('property_id', initialValue.property_id ? {
                      initialValue: initialValue.property_id,
                    } : {})(
                      <Select
                        showSearch
                        placeholder="请选择员工属性"
                        OptionFilterProp="children"
                        filterOption={this.handleSelectFilter}
                      >
                        <Option value="0">无</Option>
                        <Option value="1">108将</Option>
                        <Option value="2">36天罡</Option>
                        <Option value="3">24金刚</Option>
                        <Option value="4">18罗汉</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <Col {...fieldsBoxLayout}>
                  <FormItem {...formItemLayout2} label="身高">
                    {getFieldDecorator('height', {
                      initialValue: initialValue.height || '',
                    })(
                      <Input placeholder="请输入身高" />
                    )}
                  </FormItem>
                </Col>
                <Col {...fieldsBoxLayout}>
                  <FormItem {...formItemLayout3} label="体重(kg)">
                    {getFieldDecorator('weight', {
                      initialValue: initialValue.weight || '',
                    })(
                      <Input placeholder="请输入体重(kg)" />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col {...fieldsBoxLayout}>
                  <FormItem {...formItemLayout2} label="籍贯" name="native_place">
                    {getFieldDecorator('native_place', {
                      initialValue: initialValue.native_place || '',
                    })(
                      <Input placeholder="请输入0-30个字符" />
                    )}
                  </FormItem>
                </Col>
                <Col {...fieldsBoxLayout}>
                  <FormItem {...formItemLayout3} label="钉钉编号" name="dingding">
                    {getFieldDecorator('dingding', {
                      initialValue: initialValue.dingding || '',
                    })(
                      <Input placeholder="请输入钉钉编号" />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </TabPane>
            <TabPane forceRender tab="关系人" key="3">
              <FormItem label="关系人" {...formItemLayout4}>
                <RelativeList
                  form={form}
                  name="relatives"
                  initialValue={initialValue.relatives || []}
                />
              </FormItem>
            </TabPane>
          </Tabs>
        </Card>
      </OAModal>
    );
  }
}

