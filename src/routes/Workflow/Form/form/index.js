import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import {
  Tabs,
  Button,
} from 'antd';
import OAForm from 'components/OAForm';
import FooterToolbar from 'components/FooterToolbar';
import BasicForm from './basic';
import PCTemplate from './pc/template';
import MobileTemplate from './mobile/mobile_template';

const { TabPane } = Tabs;

@connect(({ loading }) => ({
  loading: (
    loading.effects['workflow/addForm'] ||
    loading.effects['workflow/fetchForm'] ||
    loading.effects['workflow/fetchFormType'] ||
    loading.effects['workflow/fetchValidator'] ||
    loading.effects['workflow/editForm']
  ),
}))

@OAForm.create()
@withRouter
class addForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      listError: {},
      formId: props.match.params.id,
      isEdit: props.match.params.id !== undefined,
    };
  }

  componentWillMount() {
    const { formId, isEdit } = this.state;
    if (isEdit) {
      this.fetchFormById(formId);
    }
  }

  fetchFormById = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'workflow/fetchForm',
      payload: { id },
    });
  }

  fieldListChange = (errKey, name) => {
    const { listError } = this.state;
    const fieldsError = listError[name] || {};
    let newListError = {};
    if (errKey === 'all') {
      newListError = { ...listError };
      delete newListError[name];
    } else if (fieldsError[errKey]) {
      delete fieldsError[errKey];
      newListError = {
        ...listError,
        [name]: { ...fieldsError },
      };
    }
    this.setState({ listError: newListError });
  }

  handleOnError = (errors) => {
    const { onError, form: { getFieldsValue } } = this.props;
    const gridsError = {};
    getFieldsValue().grids.forEach((_, index) => {
      gridsError[`grids.${index}.name`] = `grids[${index}].name`;
      gridsError[`grids.${index}.key`] = `grids[${index}].key`;
      gridsError[`grids.${index}.fields`] = `grids[${index}].fields`;
    });
    alert(JSON.stringify(errors));
    onError(errors, gridsError, (err) => {
      this.setState({ listError: err });
    });
  }

  handleAddSubmit = (params) => {
    // ly修改排序start
    const newParams = { ...params };
    if (params.sort === undefined || params.sort === '') {
      newParams.sort = 0;
    }
    // ly 修改排序end
    const { dispatch } = this.props;
    dispatch({
      type: 'workflow/addForm',
      payload: {
        ...newParams,
      },
      onSuccess: this.handleSubmitSuccess,
      onError: this.handleOnError,
    });
  }

  handleEditSubmit = (params) => {
    // ly修改排序start
    const newParams = { ...params };
    if (params.sort === undefined || params.sort === '') {
      newParams.sort = 0;
    }
    // ly 修改排序end
    const { dispatch } = this.props;
    const { formId } = this.state;
    dispatch({
      type: 'workflow/editForm',
      payload: {
        ...newParams,
        id: formId,
      },
      onSuccess: this.handleSubmitSuccess,
      onError: this.handleOnError,
    });
  }

  handleSubmitSuccess = () => {
    this.props.history.push('/workflow/form');
  }

  render() {
    const {
      form,
      form: {
        getFieldValue,
        getFieldsValue,
      },
      validatorRequired,
      validateFields,
    } = this.props;

    const { formId, isEdit, listError } = this.state;
    return (
      <OAForm onSubmit={validateFields(isEdit ? this.handleEditSubmit : this.handleAddSubmit)}>
        <Tabs>
          <TabPane tab="表单配置" key="basic">
            <BasicForm
              form={form}
              formId={formId}
              listError={listError}
              fieldListChange={this.fieldListChange}
              validatorRequired={validatorRequired}
            />
          </TabPane>
          <TabPane tab="PC端模板" key="pc">
            <PCTemplate
              fields={getFieldValue('fields')}
              grids={getFieldsValue().grids || []}
              fieldGroups={getFieldValue('field_groups')}
              form={form}
            />
          </TabPane>
          <TabPane tab="移动端模板" key="mobile">
            <MobileTemplate
              fields={getFieldValue('fields')}
              grids={getFieldsValue().grids || []}
              form={form}
              formname={getFieldsValue().name || ''}
            />
          </TabPane>
        </Tabs>
        <FooterToolbar>
          <Button type="primary" htmlType="submit">提交</Button>
        </FooterToolbar>
      </OAForm>
    );
  }
}

export default addForm;
