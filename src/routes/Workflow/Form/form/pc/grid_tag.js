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
      <div>
        <FieldTag data={data} onDrag={onDrag} />
        <div>
          <Icon
            type={selected ? 'minus-circle' : 'plus-circle-o'}
            className={styles.toggleButton}
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
                    <div key={`${key}.${field.key}`}>
                      <FieldTag
                        data={field}
                        onDrag={(p1, p2, p3) => {
                          // if (typeof data.x === 'number') onDrag(p1, p2, p3, data);
                          onDrag(p1, p2, p3, data);
                        }}
                      />
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
