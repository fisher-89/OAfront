import React, { Component } from 'react';
import { Row } from 'antd';
import styles from './pc_template.less';
import FieldTag from './field_tag';

class PCTemplate extends Component {
  state = {
    selectedTag: null,
  }

  makeFieldOptions = () => {
    const { fields } = this.props;
    return fields.map((field) => {
      return (
        <FieldTag
          key={field.id}
        >
          {field.name}
        </FieldTag>
      );
    });
  }

  makeGridOptions = () => {
    const { grids } = this.props;
    const { selectedTag } = this.state;
    return grids.map((grid) => {
      const { key, name, fields } = grid;
      const selected = selectedTag === key;
      return (
        <div
          key={key}
          onMouseDown={() => {
            this.setState({ selectedTag: selectedTag === key ? null : key });
          }}
        >
          <FieldTag
            color={selected ? '#1890ff' : 'blue'}
          >
            {name}
          </FieldTag>
          {selected && (
            <React.Fragment>
              <div className={styles.horizontalLine} />
              <div className={styles.gridFields}>
                <div className={styles.verticalLine} />
                {fields.map((field) => {
                  return (
                    <div key={field.id}>
                      <div className={styles.horizontalLine} />
                      <FieldTag>{field.name}</FieldTag>
                    </div>
                  );
                })}
              </div>
            </React.Fragment>
          )}
        </div>
      );
    });
  }

  makeScale = () => {
    const scale = [];
    for (let i = 0; i <= 12; i += 1) {
      scale.push(
        <div key={`scale_${i}`}>
          <span />{i}
        </div>
      );
    }
    return scale;
  }

  render() {
    const { grids } = this.props;
    return (
      <Row className={styles.pcTemplate}>
        <div className={styles.component}>
          <h3>字段</h3>
          <div className={styles.fields}>
            {this.makeFieldOptions()}
          </div>
          {grids.length > 0 && (<h3>列表控件</h3>)}
          <div className={styles.grids}>
            {this.makeGridOptions()}
          </div>
        </div>
        <div>
          <h3>表单名称</h3>
          <div className={styles.template}>
            <div className={styles.scale}>
              {this.makeScale()}
            </div>
            <div className={styles.board} />
          </div>
        </div>
      </Row>
    );
  }
}

export default PCTemplate;
