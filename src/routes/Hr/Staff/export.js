import React, { PureComponent, Fragment } from 'react';
import { Button, notification, List, Modal } from 'antd';
import { connect } from 'dva';
import XLSX from 'xlsx';

@connect(({ loading }) => ({
  loading: loading.effects['staffs/exportStaff'],
}))
export default class extends PureComponent {
  state={
    maxCols: ['员工编号', '姓名', '性别', '品牌', '费用品牌', '部门全称', '店铺代码', '职位', '员工状态', '生日', '入职时间', '手机号码', '身份证号', '银行卡号', '开户人', '开户行', '民族', 'QQ号', '微信号', '电子邮箱', '学历', '政治面貌', '婚姻状况', '身高', '体重', '户口所在地址', '现居住地址', '籍贯', '紧急联系人', '联系人电话', '联系人关系类型', '备注'],
    minCols: ['员工编号', '姓名', '性别', '品牌', '费用品牌', '店铺代码', '部门全称', '职位', '员工状态', '生日'],
  }

  confirmExport = () => {
    const { total } = this.props;
    if (total > 2000) {
      Modal.confirm({
        title: '导出超过2000条。',
        content: '这会需要较长的时间，如果不需要全部内容，请筛选后再次尝试。',
        okText: '好',
        cancelText: '继续导出',
        onCancel: () => {
          this.handleExport();
        },
      });
    } else {
      this.handleExport();
    }
  }

  handleExport = () => {
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
    const { errors } = error;
    const desc = Object.keys(errors).map((val) => {
      return errors[val][0];
    });
    notification.open({
      message: error.message,
      description: <List size="small" dataSource={desc} renderItem={item => (<List.Item>{item}</List.Item>)} />,
      duration: 10,
    });
  }

  handleSuccess = (result) => {
    if (result.length <= 1) {
      notification.warning({
        message: '没有员工数据，导出终止～',
      });
      return false;
    }
    const ws = XLSX.utils.aoa_to_sheet(result);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');
    XLSX.writeFile(wb, '员工信息.xlsx');
  }

  render() {
    const { loading } = this.props;
    return (
      <Fragment>
        <Button
          loading={loading}
          icon="cloud-download"
          onClick={this.confirmExport}
        >
          批量导出
        </Button>
      </Fragment>
    );
  }
}
