import React from 'react';
import XLSX from 'xlsx';
import { Modal, Button, Icon } from 'antd';
import OATable from '../OATable';
import styles from './index.less';

export default class Result extends React.PureComponent {
  constructor(props) {
    super(props);
    clearInterval(this.timer);
    this.timer = setInterval(this.timerCountDown, 1000);
  }

  state = {
    data: {
      data: [],
      headers: ['编号', '电话号码', '品牌'],
      errors: [
        {
          row: 1,
          rowData: ['110105', '18408228080', '杰尼维尼'],
          message: {
            员工编号: ['员工编号重复！'],
            电话号码: ['电话号重复！'],
            品牌: ['品牌输入错误！'],
          },
        },
        {
          row: 2,
          rowData: ['110105', '18408228080', '杰尼维尼专卖'],
          message: {
            员工编号: ['员工编号重复！'],
            电话号码: ['电话号重复！'],
            品牌: ['品牌输入错误！'],
          },
        },
      ],
    },
    second: 3,
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  timerCountDown = () => {
    const { second } = this.state;
    this.setState({ second: second - 1 }, () => {
      if (this.state.second === 0) {
        clearInterval(this.timer);
      }
    });
  }

  makeColumns = () => {
    const columns = [
      {
        colSpan: 0,
        title: 'row',
        align: 'center',
        dataIndex: 'row',
        render: (value, record) => {
          const obj = {
            children: `第 ${value} 行`,
            props: {
              rowSpan: !record.rowKey ? 0 : record.length,
            },
          };
          return obj;
        },
      },
      {
        colSpan: 2,
        title: '标题',
        dataIndex: 'title',
      },
      {
        width: 300,
        title: '失败原因',
        dataIndex: 'reason',
      },
    ];
    return columns;
  }

  xlsExportExcelError = ({ headers, errors }) => {
    const workbook = XLSX.utils.book_new();
    const errorExcel = [];
    const newHeaders = [...headers, '错误信息'];
    errors.forEach((error) => {
      const { rowData } = error;
      const errorMessage = error.message;
      const errMsg = Object.keys(errorMessage).map(msg => `${msg}:${errorMessage[msg].join(',')}`).join(';');
      rowData.push(errMsg);
      errorExcel.push(error.rowData);
    });
    errorExcel.unshift(newHeaders);
    const errorSheet = XLSX.utils.aoa_to_sheet(errorExcel);
    XLSX.utils.book_append_sheet(workbook, errorSheet, '错误信息');
    XLSX.writeFile(workbook, '错误信息.xlsx');
  }

  renderSuccess = () => {
    return (
      <div className={styles.content}>
        <div className={styles.resultSuccess}>
          <Icon type="check-circle" className={styles.icon} />
          <div className={styles.message}>
            成功上传
            <span className={styles.successColor}>8</span>
            条
            <p className={styles.timer}>2018-09-26 09:44:23</p>
          </div>
        </div>
        <Button
          type="primary"
          style={{
            left: '50%',
            marginTop: 20,
            marginLeft: '-50px',
            position: 'relative',
          }}
        >
          确定（{this.state.second}）
        </Button>
      </div>
    );
  }

  renderError = (response) => {
    const { errors = [] } = response;
    let errorData = [];
    errors.forEach((item) => {
      const messageLength = Object.keys(item.message).length;
      const temp = Object.keys(item.message).map((msg, index) => {
        return {
          title: msg,
          row: item.row,
          rowKey: index === 0,
          length: messageLength,
          reason: item.message[msg].join(';'),
        };
      });
      errorData = [...errorData, ...temp];
    });
    return (
      <React.Fragment>
        <div className={styles.header}>
          <div className={styles.message}>
            成功上传
            <span className={styles.successColor}>8</span>
            条，失败<span className={styles.errorColor}>1</span>条。
            <p className={styles.timer}>2018-09-26 09:44:23</p>
          </div>
          <div>
            <Button icon="upload">继续导入</Button>
          </div>
        </div>
        <div className={styles.tableResult}>
          <div className={styles.tableHeader}>
            <p>失败明细</p>
            <a onClick={() => this.xlsExportExcelError(response)}>
              下载失败明细
            </a>
          </div>
          <OATable
            bordered
            sync={false}
            data={errorData}
            pagination={false}
            scroll={{ y: 300 }}
            columns={this.makeColumns()}
          />
        </div>
      </React.Fragment>
    );
  }

  render() {
    const { error } = this.props;
    const { data } = this.state;
    return (
      <Modal {...this.props}>
        {error ? this.renderError(data) : this.renderSuccess(data)}
      </Modal>
    );
  }
}
Result.defaultProps = {
  width: 800,
  error: false,
  visible: true,
  footer: false,
  title: '导入结果',
};
