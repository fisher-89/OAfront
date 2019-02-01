import React, { Component } from 'react';
import { Icon } from 'antd';
import styles from './template.less';
import FieldTag from './field_tag';

class GridTag extends Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.data !== this.props.data) return true;
    if (nextProps.unfolded !== this.props.unfolded) return true;
    if (nextProps.selectedControl !== this.props.selectedControl) return true;
    return false;
  }

  render() {
    const {
      data,
      index,
      onDrag,
      onSelect,
      selectedControl,
      unfolded,
      toggleGridField,
    } = this.props;
    const halfGridFields = data.fields.length / 2;
    const fieldsTop = index >= halfGridFields ? ((index + 0.5) - halfGridFields) * 30 : 0;
    return (
      <div>
        <FieldTag
          data={data}
          onDrag={onDrag}
          onSelect={onSelect}
          selectedControl={selectedControl}
        />
        <Icon
          type={unfolded ? 'minus-circle' : 'plus-circle-o'}
          className={styles.toggleButton}
          onClick={() => {
            toggleGridField(data.key);
          }}
        />
        {unfolded && <div className={styles.horizontalLine} />}
        {unfolded && (
          <div className={styles.gridFields} style={{ top: `${fieldsTop}px` }}>
            <div className={styles.verticalLine} />
            {data.fields.map((field) => {
              return (
                <div key={`${data.key}.${field.key}`}>
                  <FieldTag
                    data={field}
                    onDrag={(p1, p2, p3) => {
                      onDrag(p1, p2, p3, data);
                    }}
                    onSelect={(_) => {
                      onSelect(_, data);
                    }}
                    selectedControl={selectedControl}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

export default GridTag;
