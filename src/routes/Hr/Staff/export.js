import React, { PureComponent, Fragment } from 'react';
import { Button, notification, List, Modal } from 'antd';
import { connect } from 'dva';
import XLSX from 'xlsx';
import { checkAuthority } from '../../../utils/utils';

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
        okText: '取消',
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
      payload: { ...filters },
      onError: this.handleError,
      onSuccess: (list) => {
        if (list.length <= 0) {
          notification.warning({
            message: '没有员工数据，导出终止～',
          });
          return false;
        }
        const mapWithKey = [
          { staff_sn: '员工编号', auth: 0 },
          { realname: '姓名', auth: 0 },
          { gender: '性别', auth: 0 },
          { brand: '品牌', auth: 0 },
          { cost_brand: '费用品牌', auth: 0 },
          { shop_sn: '店铺代码', auth: 0 },
          { shop_name: '店铺名称', auth: 0 },
          { department: '部门全称', auth: 0 },
          { position: '职位', auth: 0 },
          { status: '员工状态', auth: 0 },
          { hired_at: '入职时间', auth: 0 },
          { employed_at: '转正时间', auth: 0 },
          { left_at: '离职时间', auth: 0 },
          { property: '员工属性', auth: 0 },
          { mobile: '手机号码', auth: 1 },
          { id_card_number: '身份证号', auth: 1 },
          { account_number: '银行卡号', auth: 1 },
          { account_name: '开户人', auth: 1 },
          { account_bank: '开户行', auth: 1 },
          { national: '民族', auth: 1 },
          { wechat_number: '微信号', auth: 1 },
          { education: '学历', auth: 1 },
          { politics: '政治面貌', auth: 1 },
          { marital_status: '婚姻状况', auth: 1 },
          { height: '身高', auth: 1 },
          { weight: '体重', auth: 1 },
          { household_city: '户口所在地址', auth: 1 },
          { living_city: '现居住地址', auth: 1 },
          { native_place: '籍贯', auth: 1 },
          { concat_name: '紧急联系人', auth: 1 },
          { concat_tel: '联系人电话', auth: 1 },
          { concat_type: '联系人关系类型', auth: 1 },
          { remark: '备注', auth: 0 },
        ];
        const headMaps = mapWithKey.filter((item) => {
          if (!checkAuthority(190)) {
            return item.auth === 0;
          }
          return item;
        });
        const headCol = headMaps.map((map) => {
          return map[Object.keys(map)[0]];
        });
        const staff = [headCol];
        list.forEach((item) => {
          const newItem = headMaps.map((map) => {
            const key = Object.keys(map)[0];
            return item[key];
          });
          staff.push(newItem);
        });
        const workbook = XLSX.utils.book_new();
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
