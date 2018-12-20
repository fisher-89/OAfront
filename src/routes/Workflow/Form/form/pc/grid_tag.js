import React, { Component } from 'react';
import { Icon } from 'antd';
import styles from './template.less';
import FieldTag from './field_tag';

class GridTag extends Component {
  shouldComponentUpdate(nextProps) {
    const changeData = nextProps.data !== this.props.data;
    const changeSelected = nextProps.selected !== this.props.selected;
    if (changeData || changeSelected) return true;
    return false;
  }

  render() {
    const { data: { key, fields }, data, onDrag, selected, toggleGridField } = this.props;
    return (
      <div key={key}>
        <FieldTag data={data} onDrag={onDrag} />
        <div>
          <Icon
            type={selected ? 'minus-circle' : 'plus-circle-o'}
            style={{ float: 'left', marginTop: '9px', marginRight: '4px', color: '#1890ff' }}
            onClick={() => {
              toggleGridField(key);
            }}
          />
          {selected && (
            <React.Fragment>
              <div className={styles.horizontalLine} />
              <div className={styles.gridFields}>
                <div className={styles.verticalLine} />
                {fields.map((field) => {
                  return (
                    <div key={field.id}>
                      <FieldTag data={field} onDrag={onDrag} />
                    </div>
                  );
                })}
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
}

export default GridTag;
