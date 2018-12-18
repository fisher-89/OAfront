import React, { Component } from 'react';
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
    const { data: { key, fields }, data, onDrag, selected } = this.props;
    return (
      <div key={key}>
        <FieldTag color={selected ? '#1890ff' : 'blue'} data={data} onDrag={onDrag} />
        {selected && (
          <React.Fragment>
            <div className={styles.horizontalLine} />
            <div className={styles.gridFields}>
              <div className={styles.verticalLine} />
              {fields.map((field) => {
                return (
                  <div key={field.id}>
                    <div className={styles.horizontalLine} />
                    <FieldTag data={field} onDrag={onDrag} />
                  </div>
                );
              })}
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default GridTag;
