import React, { PureComponent } from 'react';
import { Icon, Input, Form } from 'antd';
import Ellipsis from '../../../../components/Ellipsis';
import styles from './index.less';

@Form.create()
export default class extends PureComponent {
  state = {
    midmid: 'hidden',
  }

  onEdit= () => {
    const { input } = this.inputRef;
    this.setState({ midmid: 'text' }, () => input.focus());
  }

  submit = (params) => {
    const { initialValue } = this.props;
    if (params.name && params.name !== initialValue.name) {
      const { typeSubmit } = this.props;
      typeSubmit(params);
    }
    this.setState({ midmid: 'hidden' });
  }

  delete = (id) => {
    const { typeDelete } = this.props;
    typeDelete(id);
  }

  render() {
    const { midmid } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { initialValue } = this.props;
    return (
      <div className={styles.tags}>
        <Form>
          {getFieldDecorator('id',
      { initialValue: initialValue.id || null,
    })(<Input type="hidden" />)}
          {getFieldDecorator('name',
      { initialValue: initialValue.name || '',
    })(
      <Input
        ref={(input) => { this.inputRef = input; }}
        type={midmid}
        onBlur={() => this.submit(this.props.form.getFieldsValue())}
        className={styles.typeinput}
      />
      )}
        </Form>
        <Ellipsis tooltip length={6} style={{ display: 'inline' }}>{initialValue.name}</Ellipsis>
        <div style={{ float: 'right' }}>
          <Icon
            className={styles.edit}
            type="edit"
            onClick={() => { this.onEdit(); }}
          />
          <Icon
            className={styles.edit}
            type="close"
            onClick={() => { this.delete(initialValue.id); }}
          />
        </div>
      </div>
    );
  }
}