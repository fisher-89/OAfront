import React, { PureComponent, Fragment } from 'react';
import {
  Popover,
  Button,
  Spin,
  notification,
} from 'antd';
import { connect } from 'dva';
import XLSX from 'xlsx';
import ImportResult from 'components/importResult';

@connect(({ staff }) => ({ staff }))
export default class extends PureComponent {
  state={
    data: [],
    cols: [],
    // 入职导入模版
    createTemp: [
      ['姓名', '手机号码', '身份证号', '性别', '品牌', '费用品牌', '部门全称', '店铺代码', '职位', '员工状态', '银行卡号', '开户人', '开户行', '民族', '微信号', '学历', '政治面貌', '婚姻状况', '身高', '体重', '户口所在地（省）', '户口所在地（市）', '户口所在地（区/县）', '户口所在地（详细地址）', '现居住地（省）', '现居住地（市）', '现居住地（区/县）', '现居住地（详细地址）', '籍贯', '紧急联系人', '联系人电话', '联系人关系类型', '备注', '钉钉用户编码', '入职日期'],
      ['测试', '15817308876', '513124199303240379', '男', '集团公司', '成都/濮院', 'IT部-开发组', '', '初级专员', '在职', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ' 请勿随便填写', '2011-01-01'],
    ],
    // 编辑导入模版
    editTemp: [
      ['员工编号', '手机号码', '银行卡号', '开户人', '开户行', '民族', '学历', '婚姻状况', '身高', '体重', '户口所在地（省）', '户口所在地（市）', '户口所在地（区/县）', '户口所在地（详细地址）', '现居住地（省）', '现居住地（市）', '现居住地（区/县）', '现居住地（详细地址）', '籍贯', '紧急联系人', '联系人电话', '联系人关系类型'],
      ['100000', '15817308876', '513124199303240379', '测试', '成都支行', '汉族', '专科', '未婚', '170', '55', '四川省', '成都市', '金牛区', 'xxx街道', '东北省', '黑龙江市', 'xxx区', 'xxx街道', '四川', '李四', '13923453212', '同学'],
    ],
    // 人事变动导入模版
    transferTemp: [
      ['员工编号', '员工状态', '所属部门', '所属品牌', '费用品牌', '职位', '店铺编号', '执行日期'],
      ['100000', '在职', 'it部-开发组', '集团公司', '成都/濮院', '经理', 'lsw2673', '2010-01-01'],
    ],
    // 批量创建字段
    createFields: [
      'realname', 'mobile', 'id_card_number', 'gender', 'brand', 'cost_brand', 'department', 'shop_sn', 'position', 'status',
      'account_number', 'account_name', 'account_bank', 'national', 'wechat_number', 'education', 'politics', 'marital_status',
      'height', 'weight', 'household_province', 'household_city', 'household_county', 'household_address', 'living_province',
      'living_city', 'living_county', 'living_address', 'native_place', 'concat_name', 'concat_tel', 'concat_type', 'remark', 'dingtalk_number', 'hired_at',
    ],
    // 批量修改字段
    changeFields: [
      'staff_sn', 'mobile', 'account_number', 'account_name', 'account_bank', 'national', 'education', 'marital_status',
      'height', 'weight', 'household_province', 'household_city', 'household_county', 'household_address', 'living_province',
      'living_city', 'living_county', 'living_address', 'native_place', 'concat_name', 'concat_tel', 'concat_type',
    ],
    // 批量变动字段
    transferFields: ['staff_sn', 'status', 'department', 'brand', 'cost_brand', 'position', 'shop_sn', 'operate_at'],
    importType: '',
    visible: false,
    spinning: false,
    tempVisible: false,
    importResult: {
      visible: false,
      error: false,
      response: {},
    },
  }

  handleVisible = (visib) => {
    this.setState({ visible: visib });
  };

  handleTempVisible = (visib) => {
    this.setState({ tempVisible: visib });
  };

  dowloadTemplet = (t, e) => {
    let data = {};
    const { createTemp, editTemp, transferTemp } = this.state;
    if (t === 1) {
      data = createTemp;
    } else if (t === 2) {
      data = editTemp;
    } else if (t === 3) {
      data = transferTemp;
    }
    const name = e.target.text;
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');
    XLSX.writeFile(wb, name);
  }

  makeCols = (refstr) => {
    const o = [];
    const C = XLSX.utils.decode_range(refstr).e.c + 1;
    const { importType, createFields, changeFields, transferFields } = this.state;
    for (let i = 0; i < C; i += 1) {
      if (importType === 'add') {
        o[i] = createFields[i];
      } else if (importType === 'edit') {
        o[i] = changeFields[i];
      } else if (importType === 'transfer') {
        o[i] = transferFields[i];
      }
    }
    return o;
  }

  handleImport = (t) => {
    this.setState({ importType: t }, () => {
      const jsft = [
        'xlsx', 'xlsb', 'xlsm', 'xls', 'xml', 'csv', 'txt', 'ods', 'fods', 'uos',
      ].map(x => `.${x}`).join(',');
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = jsft;
      input.click();
      input.onchange = (e) => {
        const files = e.target.files[0];
        this.handleFile(files);
      };
    });
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
        type: this.state.importType,
      },
      onError: this.handleError,
      onSuccess: this.handleSuccess,
    });
  }
  handleError = (response) => {
    const result = {
      visible: true,
      error: true,
      response,
    };
    this.setState({ importResult: { ...result } });
  }
  handleSuccess = () => {
    this.setState({ visible: false }, () => {
      notification.success({
        message: '导入成功',
      });
    });
  }

  render() {
    const { importResult, visible, tempVisible } = this.state;
    return (
      <Fragment>
        <ImportResult
          {...importResult}
          onCancel={() => {
            this.setState({
              importResult: {
                visible: false,
                error: importResult.error,
                response: {},
              },
            });
          }}
        />
        <Popover
          visible={tempVisible}
          trigger="click"
          placement="bottomLeft"
          onVisibleChange={this.handleTempVisible}
          content={(
            <Fragment>
              <p><a onClick={this.dowloadTemplet.bind(this, 1)}>员工入职模版.xlsx</a></p>
              <p><a onClick={this.dowloadTemplet.bind(this, 2)}>员工信息模版.xlsx</a></p>
              <div><a onClick={this.dowloadTemplet.bind(this, 3)}>人事变动模版.xlsx</a></div>
            </Fragment>
          )}
        >
          <Button icon="cloud-download">下载模版</Button>
        </Popover>
        <Popover
          visible={visible}
          trigger="click"
          placement="bottomLeft"
          onVisibleChange={this.handleVisible}
          content={(
            <Fragment>
              <Spin spinning={this.state.spinning} tip="导入中请稍后...">
                <Button type="dashed" style={{ margin: 5 }} onClick={this.handleImport.bind(null, 'add')}>员工入职</Button>
                <br />
                <Button type="dashed" style={{ margin: 5 }} onClick={this.handleImport.bind(null, 'edit')}>个人信息</Button>
                <br />
                <Button type="dashed" style={{ margin: 5 }} onClick={this.handleImport.bind(null, 'transfer')}>人事变动</Button>
              </Spin>
            </Fragment>
          )}
        >
          <Button icon="cloud-upload">批量导入</Button>
        </Popover>
      </Fragment>
    );
  }
}
