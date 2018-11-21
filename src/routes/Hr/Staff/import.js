import React, { PureComponent, Fragment } from 'react';
import {
  Divider,
  Popover,
  Button,
  Radio,
  Spin,
  List,
  notification,
} from 'antd';
import { connect } from 'dva';
import XLSX from 'xlsx';

@connect(({ staff }) => ({ staff }))
export default class extends PureComponent {
  state={
    data: [],
    cols: [],
    // 入职导入模版
    exportCreate: [
      ['姓名', '手机号码', '身份证号', '性别', '品牌', '费用品牌', '部门全称', '店铺代码', '职位', '员工状态', '银行卡号', '开户人', '开户行', '民族', '微信号', '学历', '政治面貌', '婚姻状况', '身高', '体重', '户口所在地（省）', '户口所在地（市）', '户口所在地（区/县）', '户口所在地（详细地址）', '现居住地（省）', '现居住地（市）', '现居住地（区/县）', '现居住地（详细地址）', '籍贯', '紧急联系人', '联系人电话', '联系人关系类型', '备注', '钉钉用户编码'],
      ['测试', '15817308876', '513124199303240379', '男', '集团公司', '成都/濮院', 'IT部-开发组', '', '初级专员', '在职', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ' 请勿随便填写'],
    ],
    // 编辑导入模版
    exportChange: [
      ['员工编号', '手机号码', '银行卡号', '开户人', '开户行', '民族', '学历', '婚姻状况', '身高', '体重', '户口所在地（省）', '户口所在地（市）', '户口所在地（区/县）', '户口所在地（详细地址）', '现居住地（省）', '现居住地（市）', '现居住地（区/县）', '现居住地（详细地址）', '籍贯', '紧急联系人', '联系人电话', '联系人关系类型'],
      ['100000', '15817308876', '513124199303240379', '测试', '成都支行', '汉族', '专科', '未婚', '170', '55', '四川省', '成都市', '金牛区', 'xxx街道', '东北省', '黑龙江市', 'xxx区', 'xxx街道', '四川', '李四', '13923453212', '同学'],
    ],
    // 批量创建字段
    createFields: [
      'realname', 'mobile', 'id_card_number', 'gender', 'brand', 'cost_brand', 'department', 'shop_sn', 'position', 'status',
      'account_number', 'account_name', 'account_bank', 'national', 'wechat_number', 'education', 'politics', 'marital_status',
      'height', 'weight', 'household_province', 'household_city', 'household_county', 'household_address', 'living_province',
      'living_city', 'living_county', 'living_address', 'native_place', 'concat_name', 'concat_tel', 'concat_type', 'remark', 'dingtalk_number',
    ],
    // 批量变更字段
    changeFields: [
      'staff_sn', 'mobile', 'account_number', 'account_name', 'account_bank', 'national', 'education', 'marital_status',
      'height', 'weight', 'household_province', 'household_city', 'household_county', 'household_address', 'living_province',
      'living_city', 'living_county', 'living_address', 'native_place', 'concat_name', 'concat_tel', 'concat_type',
    ],
    visible: false,
    spinning: false,
  }

  handleVisibleChange = (visib) => {
    this.setState({ visible: visib });
  };

  handleTempletChange = (e) => {
    const type = e.target.value;
    const name = { create: '批量导入', change: '批量变动' };
    const { exportCreate, exportChange } = this.state;
    const data = (type === 'create') ? exportCreate : exportChange;
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');
    XLSX.writeFile(wb, `${name[type]}.xlsx`);
  }

  makeCols = (refstr) => {
    const o = [];
    const C = XLSX.utils.decode_range(refstr).e.c + 1;
    for (let i = 0; i < C; i += 1) {
      // o[i] = { name: XLSX.utils.encode_col(i), key: i };
      if (C < 25) {
        o[i] = this.state.changeFields[i];
      } else {
        o[i] = this.state.createFields[i];
      }
    }
    return o;
  }

  handleImport = () => {
    const jsft = [
      'xlsx', 'xlsb', 'xlsm', 'xls', 'xml', 'csv', 'txt', 'ods', 'fods', 'uos',
    ].map(x => `.${x}`).join(',');
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = jsft;
    input.click();
    input.onchange = (e) => {
      const files = e.target.files[0];
      // this.setState({ spinning: true });
      this.handleFile(files);
    };
  }

  handleFile = (file) => {
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onload = (e) => {
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const source = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });
      this.setState({ data: source, cols: this.makeCols(ws['!ref']) });
      this.handleSubmit();
    };
    if (rABS) reader.readAsBinaryString(file); else reader.readAsArrayBuffer(file);
  }

  handleSubmit = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'staffs/importStaff',
      payload: {
        data: this.state.data,
        cols: this.state.cols,
      },
      onError: this.handleError,
      onSuccess: this.handleSuccess,
    });
  }

  handleError = (error) => {
    const { errors } = error;
    const desc = Object.keys(errors).map((val) => {
      return errors[val][0];
    });
    notification.open({
      message: error.message,
      description: <List size="small" dataSource={desc} renderItem={item => (<List.Item>{item}</List.Item>)} />,
      duration: 180,
    });
  }

  handleSuccess = (result) => {
    notification.success({
      message: result.message,
    });
  }

  render() {
    return (
      <Fragment>
        <Popover
          visible={this.state.visible}
          trigger="click"
          placement="bottomLeft"
          onVisibleChange={this.handleVisibleChange}
          content={(
            <Fragment>
              <Spin spinning={this.state.spinning} tip="导入中请稍后...">
                <Radio.Group onChange={this.handleTempletChange}>
                  <Radio.Button value="create">员工入职导入模版</Radio.Button>
                  <Radio.Button value="change">人事变动导入模版</Radio.Button>
                </Radio.Group>
                <Divider />
                <Button type="dashed" block onClick={this.handleImport}>批量导入</Button>
              </Spin>
            </Fragment>
          )}
        >
          <Button icon="cloud">批量导入</Button>
        </Popover>

      </Fragment>
    );
  }
}
