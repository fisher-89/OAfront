import React, { PureComponent, Fragment } from 'react';
import { Button, notification, List, Modal } from 'antd';
import { connect } from 'dva';
import XLSX from 'xlsx';
import { checkAuthority } from '../../../utils/utils';

@connect(({ loading }) => ({
  loading: loading.effects['shop/exportShop'],
}))
export default class extends PureComponent {
  confirmExport = () => {
    const { total } = this.props;
    if (total > 1000) {
      Modal.confirm({
        title: '导出超过1000条。',
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
      type: 'shop/exportShop',
      payload: { ...filters },
      onError: this.handleError,
      onSuccess: (list) => {
        if (list.length <= 0) {
          notification.warning({
            message: '没有数据，导出终止～',
          });
          return false;
        }
        const mapWithKey = [
          { shop_sn: '店铺编号', auth: 0 },
          { name: '店铺名称', auth: 0 },
          { brand: '所属品牌', auth: 0 },
          { department: '所属部门', auth: 0 },
          { manager_sn: '店长编号', auth: 0 },
          { manager_name: '店长姓名', auth: 0 },
          { staff: '店铺成员', auth: 0 },
          { address: '店铺所在地', auth: 0 },
          { status: '店铺状态', auth: 0 },
          { clock_in: '上班时间', auth: 0 },
          { clock_out: '下班时间', auth: 0 },
          { assistant_sn: '驻店人编号', auth: 0 },
          { assistant_name: '驻店人姓名', auth: 0 },
          { area_manager_name: '区域经理', auth: 0 },
          { regional_manager_name: '大区经理', auth: 0 },
          { personnel_manager_name: '人事负责人', auth: 0 },
          { opening_at: '开业日期', auth: 0 },
          { end_at: '结束日期', auth: 0 },
          { total_area: '店铺面积', auth: 0 },
          { shop_type: '店铺类型', auth: 0 },
          { work_type: '上班类型', auth: 0 },
          { city_ratio: '城市系数', auth: 0 },
          { staff_deploy: '人员配置', auth: 0 },
          { tags: '店铺标签', auth: 0 },
        ];
        const headMaps = mapWithKey.filter((item) => {
          if (!checkAuthority(196)) {
            return item.auth === 0;
          }
          return item;
        });
        const headCol = headMaps.map((map) => {
          return map[Object.keys(map)[0]];
        });
        const shop = [headCol];
        list.forEach((item) => {
          const newItem = headMaps.map((map) => {
            const key = Object.keys(map)[0];
            return item[key];
          });
          shop.push(newItem);
        });
        const workbook = XLSX.utils.book_new();
        const shopSheet = XLSX.utils.aoa_to_sheet(shop);
        XLSX.utils.book_append_sheet(workbook, shopSheet, 'SheetJS');
        XLSX.writeFile(workbook, '店铺信息.xlsx');
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
          Excel导出
        </Button>
      </Fragment>
    );
  }
}
