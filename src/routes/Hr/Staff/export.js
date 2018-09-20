import React, { PureComponent, Fragment } from 'react';
import { Button, message } from 'antd';
import { connect } from 'dva';
import XLSX from 'xlsx';

@connect(({ staffs }) => ({ staffs }))
export default class extends PureComponent {
  state={
    maxCols: ['姓名', '手机号码', '身份证号', '性别', '品牌', '费用品牌', '部门全称', '店铺代码', '职位', '员工状态', '银行卡号', '开户人', '开户行', '执行时间', '生日', '民族', 'QQ号', '微信号', '电子邮箱', '学历', '政治面貌', '婚姻状况', '身高', '体重', '户口所在地（省）', '户口所在地（市）', '户口所在地（区/县）', '户口所在地（详细地址）', '现居住地（省）', '现居住地（市）', '现居住地（区/县）', '现居住地（详细地址）', '籍贯', '紧急联系人', '联系人电话', '联系人关系类型', '备注', '操作备注', '钉钉用户编码'],
    minCols: ['员工编号', '姓名', '品牌', '费用品牌', '部门全称', '店铺代码', '职位', '员工状态', '执行时间', '操作备注'],
    data: [],
  }

  exportStaff = () => {
    const { data } = this.state;
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');
    XLSX.writeFile(wb, '员工信息.xlsx');
  }

  fetchStaff = () => {
    const { maxCols, minCols } = this.state;
    const { dispatch, filters } = this.props;
    dispatch({
      type: 'staffs/exportStaff',
      payload: {
        ...filters,
        maxCols,
        minCols,
      },
      onError: this.handleError,
      onSuccess: this.handleSuccess,
    });
  }

  handleError = (error) => {
    console.log(error);
    message.warning('数据错误，导出终止～');
  }

  handleSuccess = (result) => {
    if (result.length <= 1) {
      message.warning('没有员工数据，导出终止～');
      return false;
    }
    const ws = XLSX.utils.aoa_to_sheet(result);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');
    XLSX.writeFile(wb, '员工信息.xlsx');
  }

  render() {
    return (
      <Fragment>
        <Button
          icon="cloud-download"
          onClick={() => {
            this.fetchStaff();
          }}
        >
          批量导出
        </Button>
      </Fragment>
    );
  }
}
