import React, { PureComponent, Fragment } from 'react';
import { Form, Input, Button, List } from 'antd';
import ListItem from './listitem';
import './index.less';

@Form.create()
export default class extends PureComponent {
  state = {
    textType: 'hidden',
  }

  addType = () => {
    const { input } = this.typeadd;
    this.setState({ textType: 'text' }, () => input.focus());
  }

  submit = (params) => {
    if (params.name) {
      const { typeSubmit } = this.props;
      const { setFieldsValue } = this.props.form;
      typeSubmit(params);
      setFieldsValue({ name: '' });
    }
    this.setState({ textType: 'hidden' });
  }

  render() {
    const { ruletype, typeDelete, typeSubmit } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { textType } = this.state;
    return (
      <Fragment>
        <Button
          icon="plus"
          type="dashed"
          size="small"
          style={{ color: '#888', width: '100%', marginBottom: 10 }}
          onClick={() => this.addType()}
        >
    添加类型
        </Button>
        <List
          dataSource={ruletype}
          bordered
          size="small"
          renderItem={(item) => {
          return (
            <List.Item >
              <ListItem initialValue={item} typeDelete={typeDelete} typeSubmit={typeSubmit} />
            </List.Item>
          );
        }}
        />
        <Form>
          {getFieldDecorator('name',
      { initialValue: '',
    })(
      <Input
        ref={(input) => { this.typeadd = input; }}
        type={textType}
        onBlur={() => this.submit(this.props.form.getFieldsValue())}
      />
    )}
        </Form>
      </Fragment>
    );
  }
}
