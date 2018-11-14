import React, { PureComponent, Fragment } from 'react';
import { Button, notification, List, Modal } from 'antd';
import { connect } from 'dva';
import XLSX from 'xlsx';

@connect(({ loading }) => ({
  loading: loading.effects['staffs/exportStaff'],
}))
export default class extends PureComponent {
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
    const { dispatch, filters } = this.props;
    dispatch({
      type: 'staffs/exportStaff',
      payload: filters,
      onError: this.handleError,
      onSuccess: (list) => {
        if (list.length <= 0) {
          notification.warning({
            message: '没有员工数据，导出终止～',
          });
          return false;
        }
        const workbook = XLSX.utils.book_new();
        const staff = [];
        list.forEach((item) => {
          staff.push([
            item.staff_sn,
            item.realname,
            item.gender,
            item.brand,
            item.cost_brand,
            item.shop_sn,
            item.shop_name,
            item.department,
            item.position,
            item.status,
            item.hired_at,
            item.mobile || '',
            item.id_card_number || '',
            item.account_number || '',
            item.account_name || '',
            item.account_bank || '',
            item.national || '',
            item.wechat_number || '',
            item.education || '',
            item.politics || '',
            item.marital_status || '',
            item.height || '',
            item.weight || '',
            item.household_city || '',
            item.living_city || '',
            item.native_place || '',
            item.concat_name || '',
            item.concat_tel || '',
            item.concat_type || '',
            item.remark || '',
          ]);
        });
        staff.unshift([
          '员工编号', '姓名', '性别', '品牌', '费用品牌', '店铺代码', '店铺名称', '部门全称', '职位', '员工状态', '入职时间', '手机号码',
          '身份证号', '银行卡号', '开户人', '开户行', '民族', '微信号', '学历', '政治面貌', '婚姻状况', '身高', '体重',
          '户口所在地址', '现居住地址', '籍贯', '紧急联系人', '联系人电话', '联系人关系类型', '备注',
        ]);
        const staffSheet = XLSX.utils.aoa_to_sheet(staff);
        XLSX.utils.book_append_sheet(workbook, staffSheet, 'SheetJS');
        XLSX.writeFile(workbook, '员工信息.xlsx');
      },
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
