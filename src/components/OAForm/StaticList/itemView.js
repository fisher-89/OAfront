import React from 'react';
import { Tooltip } from 'antd';
import styles from '../FormList/index.less';

export default function ItemView({ data }) {
  return (
    <React.Fragment>
      {Object.keys(data).map((name, index) => {
        const key = `item-${index}`;
        const { value } = data[name];
        const content = (
          <div className={styles.colspan} key={key}>
            <span className={styles.title}>{name}：</span>
            <span>{value}</span>
          </div>
        );
        return value ? (
          <Tooltip title={value} key={key}>
            {content}
          </Tooltip>
        ) : content;
      })}
    </React.Fragment>
  );
}
