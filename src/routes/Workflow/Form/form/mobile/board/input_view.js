/**
 * Created by sushaochun on 2018/12/31.
 */
import React, { PureComponent } from 'react';
import style from './inputView.less';

export default class Textinput extends PureComponent {
  render() {
    const { data } = this.props;
    const { type } = data;
    // const typeList = ['file', 'text', 'date', 'datetime', 'time',
    //  'file', 'array', 'select', 'department', 'staff', 'shop', 'region', 'api'];
    if (type === 'text' || type === 'int' || type === 'array') {
      return (
        <div className={style.textTag}>
          <div className={style.tagname}>{data.name}</div>
          <div className={style.tagcontainer}>{data.description || `请输入${data.name}` }</div>
        </div>
      );
    }

    if (type === 'department' || type === 'date' || type === 'datetime' || type === 'time' || type === 'api' || type === 'shop' || type === 'select' || type === 'staff' || type === 'region') {
      return (
        <div className={style.textTag}>
          <div className={style.tagname}>{data.name}</div>
          <div className={style.tagcontainer}>
            <div className={style.selectText}>
              {data.description || `请输入${data.name}`}
            </div>
            <i className={style.selectIcon} />
          </div>
        </div>
      );
    }
    if (type === 'file') {
      return (
        <div className={style.textTag}>
          <div className={style.tagname}>{data.name}</div>
          <div className={style.tagcontainer}>
            <div className={style.fileupload}><i /></div>
            <div className={style.fileupload}><i /></div>
            <div className={style.fileupload}><i /></div>
            <div className={style.fileupload} style={{ marginRight: '0' }}><i /></div>
          </div>
        </div>
      );
    }
    if (type === undefined) {
      return (
        <div className={style.controlTag}>
          {data.name}
          <i className={style.controlIcon} />
        </div>
      );
    }
  }
}
