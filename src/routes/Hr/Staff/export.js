import React, { PureComponent, Fragment } from 'react';
import { Button } from 'antd';
import { connect } from 'dva';
import XLSX from 'xlsx';

@connect(({ staffs }) => ({
  staff: staffs.staff,
}))
export default class extends PureComponent {
  state={
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
    console.log(this.props);
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'staffs/exportStaff',
    //   onError: this.handleError,
    //   onSuccess: this.handleSuccess,
    // });
  }

  handleError = (error) => {
    console.log(error);
  }

  handleSuccess = (result) => {
    this.setState({ data: result }, () => this.exportStaff());
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
