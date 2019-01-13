import React, { Component } from 'react';
import { Icon } from 'antd';
import styles from './index.less';
import Input from './input';
import Select from './select';
import Upload from './upload';
import Date from './date';
import Time from './time';
import Region from './region';
import Array from './array';
import Search from './search';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  textInput = () => {
    const { data } = this.props;
    return <Input data={data} />;
  }

  intInput = () => {
    return this.textInput();
  }

  dateInput = () => {
    const { data } = this.props;
    return <Date data={data} />;
  }

  datetimeInput = () => {
    return this.dateInput();
  }

  timeInput = () => {
    const { data } = this.props;
    return <Time data={data} />;
  }

  selectInput = () => {
    const { data } = this.props;
    return <Select data={data} />;
  }

  apiInput = () => {
    return this.selectInput();
  }

  departmentInput = () => {
    return this.selectInput();
  }

  arrayInput = () => {
    return <Array />;
  }

  fileInput = () => {
    return <Upload />;
  }

  staffInput = () => {
    const { data } = this.props;
    if (data.is_checkbox || data.available_options.length > 0) {
      return <Select data={data} />;
    } else {
      return <Search data={data} />;
    }
  }

  shopInput = () => {
    return this.staffInput();
  }

  regionInput = () => {
    const { data } = this.props;
    return <Region data={data} />;
  }

  render() {
    const { data } = this.props;
    return 'fields' in data ? (
      <div className={styles.gridControl}>
        <div className={styles.gridHeader}>
          {data.name}
        </div>
        <div className={styles.gridContent}>
          <div className={styles.deleteButton}>
            <Icon type="close" />
          </div>
        </div>
        <div className={styles.gridFooter}>
          <div className={styles.addButton}>
            <Icon type="plus" />
          </div>
        </div>
      </div>
    ) : (
      <div className={styles.control}>
        <div className={styles.label}>
          {data.name}：
        </div>
        <div className={styles.input}>
          {eval(`this.${data.type}Input()`)}
        </div>
      </div>
    );
  }
}

