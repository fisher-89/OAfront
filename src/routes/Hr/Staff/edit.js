import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Tabs,
  Input,
  Radio,
  Select,
  Switch,
  message,
  TreeSelect,
} from 'antd';
import { omit } from 'lodash';
import OAForm, { SearchTable, Address, OAModal } from '../../../components/OAForm';
import RelativeList from './relativeList';
import NextForm from './nextForm';
import { markTreeData } from '../../../utils/utils';


const FormItem = OAForm.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

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

const formItemLayout2 = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 10 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};
const fieldsBoxLayout = { xs: 24, lg: 12 };
const formItemLayout3 = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 10 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};
@OAForm.create()
@connect(({ brand, expense, position, department, staffs, loading }) => ({
  brand: brand.brand,
  expense: expense.expense,
  position: position.position,
  department: department.department,
  staffInfo: staffs.staffDetails,
  staffLoading: loading.models.staffs,
}))
export default class EditStaff extends PureComponent {
  state = {
    visible: false,
  }

  handleSubmit = (params) => {
    const { dispatch, onError, onCancel } = this.props;
    if (!params.operate_at) {
      message.error('请选择执行日期！！');
      return;
    }
    const body = {
      ...params,
      ...params.recruiter,
      ...params.household,
      ...params.living,
      shop_sn: params.shop.shop_sn || '',
      is_active: params.is_active ? 1 : 0,
      account_active: params.account_active ? 1 : 0,
    };
    omit(body, ['recruiter', 'household', 'living', 'shop']);
    const relatives = (body.relatives || []).map(item =>
      ({ ...item.relative, relative_type: item.relative_type })
    );
    body.relatives = relatives;
    dispatch({
      type: params.staff_sn ? 'staffs/editStaff' : 'staffs/addStaff',
      payload: body,
      onError: (errors) => {
        this.setState({ visible: false }, onError(errors, {
          household_address: 'household',
          living_address: 'living',
        }));
      },
      onSuccess: () => {
        this.setState({ visible: false }, onCancel());
      },
    });
  }

  handleNextForm = () => {
    this.setState({ visible: true });
  }

  handleSelectFilter = (input, option) => {
    return (option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0);
  }

  render() {
    const {
      form,
      brand,
      expense,
      visible,
      onCancel,
      position,
      editStaff,
      department,
      staffLoading,
      validateFields,
      validatorRequired,
      form: { getFieldDecorator } } = this.props;
    const newTreeData = markTreeData(department, { value: 'id', lable: 'name', parentId: 'parent_id' }, 0);
    const style = { maxHeight: 600, overflowY: 'auto', overflowX: 'hidden' };

    const tabPaneTitleStyle = { width: 118, textAlign: 'center' };
    const renderTitle = title => <div style={tabPaneTitleStyle}>{title}</div>;
    const isEdit = editStaff.staff_sn !== undefined;
    return (
      <React.Fragment>
        <NextForm
          form={form}
          visible={this.state.visible}
          onSubmit={validateFields(this.handleSubmit)}
          onCancel={() => { this.setState({ visible: false }); }}
        />
        <OAModal
          width={800}
          title="员工"
          okText="下一步"
          visible={visible}
          style={{ top: 30 }}
          onCancel={onCancel}
          loading={staffLoading}
          onSubmit={validateFields(this.handleNextForm)}
          actionType={editStaff.staff_sn !== undefined}
        >
          <Tabs defaultActiveKey="1">
            <TabPane forceRender tab={renderTitle('基础资料')} key="1" style={style}>
              <Row>
                <Col {...fieldsBoxLayout}>
                  {editStaff.staff_sn
                    ? getFieldDecorator('staff_sn', {
                      initialValue: editStaff.staff_sn,
                    })(<Input type="hidden" />)
                    : null}
                  {getFieldDecorator('operation_type', {
                    initialValue: editStaff.staff_sn ? 'edit' : 'entry',
                  })(
                    <Input type="hidden" />
                  )}
                  <FormItem {...formItemLayout2} label="员工姓名" required>
                    {getFieldDecorator('realname', {
                      initialValue: editStaff.realname || '',
                      rules: [validatorRequired],
                    })(
                      <Input placeholder="请输入员工姓名" />
                    )}
                  </FormItem>
                </Col>
                <Col {...fieldsBoxLayout}>
                  <FormItem {...formItemLayout2} label="身份证号" required>
                    {getFieldDecorator('id_card_number', {
                      initialValue: editStaff.id_card_number || '',
                      rules: [validatorRequired],
                    })(
                      <Input placeholder="请输入身份证号" />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col {...fieldsBoxLayout}>
                  <FormItem {...formItemLayout3} label="电话号码" required>
                    {getFieldDecorator('mobile', {
                      initialValue: editStaff.mobile || '',
                      rules: [validatorRequired],
                    })(
                      <Input placeholder="请输入电话号码" />
                    )}
                  </FormItem>
                </Col>

                <Col {...fieldsBoxLayout}>
                  <FormItem {...formItemLayout3} label="性别" required>
                    {getFieldDecorator('gender', {
                      initialValue: editStaff.gender || '未知',
                      rules: [validatorRequired],
                    })(
                      <RadioGroup size="small" buttonStyle="solid">
                        <RadioButton value="未知">未知</RadioButton>
                        <RadioButton value="男">男</RadioButton>
                        <RadioButton value="女">女</RadioButton>
                      </RadioGroup>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col {...fieldsBoxLayout}>
                  <FormItem label="所属品牌" {...formItemLayout2} required>
                    {getFieldDecorator('brand_id', {
                      initialValue: editStaff.brand_id || undefined,
                      rules: [validatorRequired],
                    })(
                      <Select placeholer="请选择" disabled={isEdit}>
                        {brand && brand.map((item) => {
                          return (
                            <Option key={item.id} value={item.id}>{item.name}</Option>
                          );
                        })}
                      </Select>
                    )}
                  </FormItem>
                </Col>

                <Col {...fieldsBoxLayout}>
                  <FormItem label="职位" {...formItemLayout2} required>
                    {getFieldDecorator('position_id', {
                      initialValue: editStaff.position_id || 1,
                      rules: [validatorRequired],
                    })(
                      <Select placeholer="请选择" disabled={isEdit}>
                        {position.map((item) => {
                          return (
                            <Option key={item.id} value={item.id}>{item.name}</Option>
                          );
                        })}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormItem label="费用品牌" {...formItemLayout} required>
                    {getFieldDecorator('cost_brands', {
                      initialValue: (editStaff.cost_brands || []).map(item => `${item.id}`),
                      rules: [validatorRequired],
                    })(
                      <Select placeholer="请选择" mode="multiple">
                        {expense.map((item) => {
                          return (
                            <Option key={`${item.id}`}>{item.name}</Option>
                          );
                        })}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormItem label="所属部门" {...formItemLayout} required>
                    {getFieldDecorator('department_id', {
                      initialValue: `${editStaff.department_id || ''}`,
                      rules: [validatorRequired],
                    })(
                      <TreeSelect
                        disabled={isEdit}
                        treeDefaultExpandAll
                        treeData={newTreeData}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <Col {...fieldsBoxLayout}>
                  <FormItem {...formItemLayout3} label="员工状态" required>
                    {getFieldDecorator('status_id', {
                      initialValue: (editStaff.status_id !== undefined) ? editStaff.status_id : 1,
                      rules: [validatorRequired],
                    })(
                      <Select placeholer="请选择" disabled={isEdit}>
                        <Option value={0}>离职中</Option>
                        <Option value={1}>试用期</Option>
                        <Option value={2}>在职</Option>
                        <Option value={3}>停薪留职</Option>
                        <Option value={-1}>离职</Option>
                        <Option value={-2}>自动离职</Option>
                        <Option value={-3}>开除</Option>
                        <Option value={-4}>劝退</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col {...fieldsBoxLayout}>
                  <FormItem {...formItemLayout3} label="员工属性">
                    {getFieldDecorator('property', {
                      initialValue: `${editStaff.property || 0}`,
                    })(
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

              <FormItem {...formItemLayout} label="所属店铺">
                {getFieldDecorator('shop', {
                  initialValue: editStaff.shop_sn ? {
                    shop_name: editStaff.shop.name,
                    shop_sn: editStaff.shop_sn,
                  } : {},
                })(
                  <SearchTable.Shop />
                )}
              </FormItem>
              {/* <FormItem label="员工标签" {...formItemLayout}>
              {getFieldDecorator('tags', {
                initialValue: [],
              })(
                <Select placeholer="请选择">
                  <Option value="">请选择</Option>
                </Select>
              )}
              </FormItem> */}
              <FormItem {...formItemLayout} label="员工备注" name="remark">
                {getFieldDecorator('remark', {
                  initialValue: editStaff.remark || '',
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
            </TabPane>

            <TabPane forceRender tab={renderTitle('个人信息')} key="2" style={style}>
              <Row>
                <Col {...fieldsBoxLayout}>
                  <FormItem {...formItemLayout3} label="开户行" name="account_bank">
                    {getFieldDecorator('account_bank', {
                      initialValue: editStaff.account_bank || '',
                    })(
                      <Input placeholder="如：中国农业银行成都荷花池支行" />
                    )}
                  </FormItem>
                </Col>
                <Col {...fieldsBoxLayout}>
                  <FormItem {...formItemLayout2} label="银行卡号" >
                    {getFieldDecorator('account_number', {
                      initialValue: editStaff.account_number || '',
                    })(
                      <Input placeholder="请输入银行卡号" />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col {...fieldsBoxLayout}>
                  <FormItem {...formItemLayout2} label="开户人" name="account_name">
                    {getFieldDecorator('account_name', {
                      initialValue: editStaff.account_name || '',
                    })(
                      <Input placeholder="请输入开户人" />
                    )}
                  </FormItem>
                </Col>
                <Col {...fieldsBoxLayout}>
                  <FormItem {...formItemLayout3} label="使用工资卡" name="account_active">
                    {getFieldDecorator('account_active', {
                      initialValue: editStaff.account_active === 1,
                      valuePropName: 'checked',
                    })(
                      <Switch
                        onChange={(value) => {
                          form.setFieldsValue({ account_active: value ? 1 : 0 });
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
                      initialValue: editStaff.concat_name || '',
                    })(
                      <Input placeholder="请输入紧急联系人" />
                    )}
                  </FormItem>
                </Col>
                <Col {...fieldsBoxLayout}>
                  <FormItem {...formItemLayout3} label="联系人电话" >
                    {getFieldDecorator('concat_tel', {
                      initialValue: editStaff.concat_tel || '',
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
                      initialValue: editStaff.concat_type || '',
                    })(
                      <Input placeholder="请输入联系人类型" />
                    )}
                  </FormItem>
                </Col>
                <Col {...fieldsBoxLayout}>
                  <FormItem {...formItemLayout3} label="微信号" >
                    {getFieldDecorator('wechat_number', {
                      initialValue: editStaff.wechat_number || '',
                    })(
                      <Input placeholder="请输入微信号" />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col {...fieldsBoxLayout}>
                  <FormItem {...formItemLayout2} label="钉钉编号">
                    {getFieldDecorator('dingtalk_number', {
                      initialValue: editStaff.dingtalk_number || '',
                    })(
                      <Input placeholder="请输入钉钉编号" />
                    )}
                  </FormItem>
                </Col>
                <Col {...fieldsBoxLayout}>
                  <FormItem {...formItemLayout2} label="招聘人员">
                    {getFieldDecorator('recruiter', {
                      initialValue: {
                        recruiter_sn: editStaff.recruiter_sn || '',
                        recruiter_name: editStaff.recruiter_name || '',
                      },
                    })(
                      <SearchTable.Staff
                        name={{
                          recruiter_sn: 'staff_sn',
                          recruiter_name: 'realname',
                        }}
                        showName="recruiter_name"
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>

            </TabPane>
            <TabPane forceRender tab={renderTitle('个人信息')} key="3" style={style}>
              <FormItem {...formItemLayout} label="户口所在地">
                {
                  getFieldDecorator('household', {
                    initialValue: {
                      household_city_id: editStaff.household_city_id || '',
                      household_province_id: editStaff.household_province_id || '',
                      household_county_id: editStaff.household_county_id || '',
                      household_address: editStaff.household_address || '',
                    },
                  })(
                    <Address
                      name={{
                        household_city_id: 'city_id',
                        household_province_id: 'province_id',
                        household_county_id: 'county_id',
                        household_address: 'address',
                      }}
                    />
                  )
                }
              </FormItem>
              <FormItem {...formItemLayout} label="现居住地">
                {
                  getFieldDecorator('living', {
                    initialValue: {
                      living_city_id: editStaff.living_city_id || '',
                      living_province_id: editStaff.living_province_id || '',
                      living_county_id: editStaff.living_county_id || '',
                      living_address: editStaff.living_address || '',
                    },
                  })(
                    <Address
                      name={{
                        living_city_id: 'city_id',
                        living_province_id: 'province_id',
                        living_county_id: 'county_id',
                        living_address: 'address',
                      }}
                    />
                  )
                }
              </FormItem>
              <Row>
                <Col {...fieldsBoxLayout}>
                  <FormItem {...formItemLayout2} label="籍贯">
                    {getFieldDecorator('native_place', {
                      initialValue: editStaff.native_place || '',
                      rules: [{ max: 30, message: '最大长度为30个字符' }],
                    })(
                      <Input placeholder="请输入0-30个字符" />
                    )}
                  </FormItem>
                </Col>
                <Col {...fieldsBoxLayout}>
                  <FormItem {...formItemLayout3} label="民族">
                    {getFieldDecorator('national', {
                      initialValue: editStaff.national || '未知',
                    })(
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
                    {getFieldDecorator('education', {
                      initialValue: editStaff.education || '未知',
                    })(
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
                    {getFieldDecorator('politics', {
                      initialValue: editStaff.politics || '未知',
                    })(
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
                    {getFieldDecorator('marital_status', {
                      initialValue: editStaff.marital_status || '未知',
                    })(
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


              </Row>

              <Row>
                <Col {...fieldsBoxLayout}>
                  <FormItem {...formItemLayout2} label="身高(cm)">
                    {getFieldDecorator('height', {
                      initialValue: editStaff.height || '',
                    })(
                      <Input placeholder="请输入身高" />
                    )}
                  </FormItem>
                </Col>
                <Col {...fieldsBoxLayout}>
                  <FormItem {...formItemLayout3} label="体重(kg)">
                    {getFieldDecorator('weight', {
                      initialValue: editStaff.weight || '',
                    })(
                      <Input placeholder="请输入体重(kg)" />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </TabPane>
            <TabPane forceRender tab={renderTitle('关系人')} key="4" style={style}>
              <RelativeList
                form={form}
                name="relatives"
                validatorRequired={validatorRequired}
                initialValue={editStaff.relatives || []}
              />
            </TabPane>
          </Tabs>
        </OAModal>
      </React.Fragment>

    );
  }
}

